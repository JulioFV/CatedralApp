import { ApiError } from '@/api/axiosClient';
import { getPreguntas } from '@/api/services/preguntaService';
import { registrarRespuesta } from '@/api/services/securityService';
import { CustomAlert as Alert } from '@/components/CustomAlert';
import { Pregunta } from '@/models/Pregunta';
import { Check, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface SecurityQuestionModalProps {
    visible: boolean;
    id_usuario: number;
    onClose: () => void;
    onRegistered: () => void;
}

export default function SecurityQuestionModal({
    visible,
    id_usuario,
    onClose,
    onRegistered,
}: SecurityQuestionModalProps) {
    const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
    const [loadingPreguntas, setLoadingPreguntas] = useState<boolean>(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [selectedPreguntaId, setSelectedPreguntaId] = useState<number | null>(null);
    const [respuesta, setRespuesta] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Cada vez que se abre el modal: reinicia el formulario y carga las preguntas
    useEffect(() => {
        if (!visible) return;

        setSelectedPreguntaId(null);
        setRespuesta('');
        setErrors({});

        const loadPreguntas = async (): Promise<void> => {
            try {
                setLoadingPreguntas(true);
                setLoadError(null);
                const result = await getPreguntas();
                if (!result.error) {
                    setPreguntas(result.contenido);
                }
            } catch (error) {
                const apiError = error as ApiError;
                setLoadError(apiError.mensaje ?? 'No se pudieron cargar las preguntas');
            } finally {
                setLoadingPreguntas(false);
            }
        };

        loadPreguntas();
    }, [visible]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!selectedPreguntaId) newErrors.pregunta = 'Selecciona una pregunta';
        if (!respuesta.trim()) newErrors.respuesta = 'Escribe tu respuesta';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitRespuesta = async (): Promise<void> => {
        if (!selectedPreguntaId) return;

        try {
            setSubmitting(true);
            const result = await registrarRespuesta({
                id_usuario,
                id_pregunta: selectedPreguntaId,
                respuesta: respuesta.trim(),
            });

            if (!result.error) {
                Alert.alert('Listo', result.mensaje, [
                    {
                        text: 'Aceptar',
                        onPress: () => {
                            onRegistered();
                            onClose();
                        },
                    },
                ]);
            } else {
                Alert.alert('No se pudo registrar', result.mensaje);
            }
        } catch (error) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.mensaje || 'Ocurrió un error al registrar tu respuesta');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = (): void => {
        if (!validate()) return;

        const preguntaSeleccionada = preguntas.find((p) => p.id_pregunta === selectedPreguntaId);

        Alert.alert(
            '¿Confirmar respuesta?',
            `Pregunta: "${preguntaSeleccionada?.descripcion}"\n\nUna vez guardada, no podrás cambiar la pregunta ni la respuesta. Se usará para restablecer tu contraseña en el futuro.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: submitRespuesta },
            ]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Pregunta de seguridad</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={22} color="#555" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.description}>
                        Esta pregunta se usará para restablecer tu contraseña si la olvidas. Una vez
                        registrada, no podrá modificarse.
                    </Text>

                    {loadingPreguntas ? (
                        <ActivityIndicator size="large" color="#7A1F1F" style={styles.loader} />
                    ) : loadError ? (
                        <Text style={styles.errorText}>{loadError}</Text>
                    ) : (
                        <>
                            <Text style={styles.label}>SELECCIONA UNA PREGUNTA</Text>
                            <ScrollView style={styles.questionList} nestedScrollEnabled>
                                {preguntas.map((pregunta) => {
                                    const isSelected = pregunta.id_pregunta === selectedPreguntaId;
                                    return (
                                        <TouchableOpacity
                                            key={pregunta.id_pregunta}
                                            style={[
                                                styles.questionOption,
                                                isSelected && styles.questionOptionSelected,
                                            ]}
                                            onPress={() => {
                                                setSelectedPreguntaId(pregunta.id_pregunta);
                                                setErrors((prev) => ({ ...prev, pregunta: '' }));
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <View
                                                style={[
                                                    styles.radioCircle,
                                                    isSelected && styles.radioCircleSelected,
                                                ]}
                                            >
                                                {isSelected && <Check size={14} color="white" />}
                                            </View>
                                            <Text style={styles.questionText}>{pregunta.descripcion}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                            {errors.pregunta ? <Text style={styles.errorHint}>{errors.pregunta}</Text> : null}

                            <Text style={styles.label}>TU RESPUESTA</Text>
                            <TextInput
                                style={[styles.input, errors.respuesta && styles.inputError]}
                                placeholder="Escribe tu respuesta"
                                placeholderTextColor="#A1A1AA"
                                value={respuesta}
                                onChangeText={setRespuesta}
                            />
                            {errors.respuesta ? <Text style={styles.errorHint}>{errors.respuesta}</Text> : null}

                            <TouchableOpacity
                                style={styles.submitButton}
                                activeOpacity={0.85}
                                onPress={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Registrar respuesta</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    sheet: {
        width: '100%',
        maxWidth: 440,
        maxHeight: '85%',
        backgroundColor: '#F8F7F4',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#D9D7D2',
        padding: 20,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    title: { fontSize: 18, fontWeight: '700', color: '#7A1F1F', flex: 1, paddingRight: 10 },
    closeButton: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
    description: { fontSize: 13, color: '#6B7280', lineHeight: 19, marginBottom: 16 },
    label: { fontSize: 12, fontWeight: '700', color: '#4B5563', letterSpacing: 0.6, marginBottom: 8, marginTop: 4 },
    loader: { marginVertical: 30 },
    errorText: { color: '#B91C1C', fontSize: 14, textAlign: 'center', marginVertical: 20 },
    questionList: { maxHeight: 200, marginBottom: 4 },
    questionOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E3DE',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    questionOptionSelected: { borderColor: '#C9A44C', backgroundColor: '#F1E9D2' },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#8B8B8B',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    radioCircleSelected: { backgroundColor: '#7A1F1F', borderColor: '#7A1F1F' },
    questionText: { fontSize: 14, color: '#1F2937', flex: 1 },
    errorHint: { fontSize: 12, color: '#B91C1C', marginBottom: 10 },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
        marginBottom: 4,
    },
    inputError: { borderColor: '#B91C1C' },
    submitButton: {
        marginTop: 16,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#7A1F1F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: { color: 'white', fontSize: 15, fontWeight: '700' },
});