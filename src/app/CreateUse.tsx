import { ApiError } from '@/api/axiosClient';
import { createUso, updateUso, UsoPayload } from '@/api/services/usoService';
import { Uso } from '@/models/Uso';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const ESTADO_ACTIVO = 1;
const ESTADO_INACTIVO = 2; // Confirmar con backend — ver nota en la respuesta

export default function CreateUse() {
    const router = useRouter();
    const { id_uso, usoData } = useLocalSearchParams<{ id_uso?: string; usoData?: string }>();

    const isEditMode = !!id_uso;

    const parsedUso: Uso | null = useMemo(
        () => (usoData ? JSON.parse(usoData) : null),
        [usoData]
    );

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [estado, setEstado] = useState<number>(ESTADO_ACTIVO);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Modo edición: prellenar el formulario con los datos recibidos
    useEffect(() => {
        if (!parsedUso) return;

        setName(parsedUso.nombre);
        setDescription(parsedUso.descripcion ?? '');
        setEstado(parsedUso.estado);
    }, [parsedUso]);

    const handleBack = (): void => {
        router.back();
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) newErrors.name = 'El nombre es obligatorio';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (): Promise<void> => {
        if (!validate()) return;

        const payload: UsoPayload = {
            nombre: name.trim(),
            descripcion: description.trim(),
            estado,
        };

        try {
            setSubmitting(true);

            const result =
                isEditMode && parsedUso
                    ? await updateUso(parsedUso.id_uso, payload)
                    : await createUso(payload);

            if (!result.error) {
                Alert.alert('Éxito', result.mensaje, [
                    { text: 'Aceptar', onPress: () => router.back() },
                ]);
            } else {
                Alert.alert('No se pudo guardar', result.mensaje);
            }
        } catch (error) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.mensaje || 'Ocurrió un error al guardar el uso');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                            <ArrowLeft size={22} color="#555" />
                        </TouchableOpacity>

                        <Text style={styles.title}>{isEditMode ? 'Editar Uso' : 'Nuevo Uso'}</Text>

                        <View style={styles.headerButton} />
                    </View>

                    {/* Nombre del uso */}
                    <View style={styles.field}>
                        <Text style={styles.label}>NOMBRE DEL USO</Text>
                        <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            placeholder="Ej: Liturgia Dominical"
                            placeholderTextColor="#A1A1AA"
                            value={name}
                            onChangeText={setName}
                        />
                        {errors.name ? <Text style={styles.errorHint}>{errors.name}</Text> : null}
                    </View>

                    {/* Descripción */}
                    <View style={styles.field}>
                        <Text style={styles.label}>DESCRIPCIÓN</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe brevemente en qué consiste este uso..."
                            placeholderTextColor="#A1A1AA"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Estado */}
                    <View style={styles.field}>
                        <Text style={styles.label}>ESTADO</Text>
                        <View style={styles.segmentedControl}>
                            <TouchableOpacity
                                style={[
                                    styles.segmentOption,
                                    estado === ESTADO_ACTIVO && styles.segmentOptionActive,
                                ]}
                                onPress={() => setEstado(ESTADO_ACTIVO)}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.segmentText,
                                        estado === ESTADO_ACTIVO && styles.segmentTextActive,
                                    ]}
                                >
                                    ACTIVO
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.segmentOption,
                                    estado === ESTADO_INACTIVO && styles.segmentOptionInactive,
                                ]}
                                onPress={() => setEstado(ESTADO_INACTIVO)}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.segmentText,
                                        estado === ESTADO_INACTIVO && styles.segmentTextActive,
                                    ]}
                                >
                                    INACTIVO
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Botón */}
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.85}
                        onPress={handleRegister}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <Check size={20} color="white" />
                                <Text style={styles.buttonText}>
                                    {isEditMode ? 'Guardar Cambios' : 'Registrar Uso'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F4F0' },
    content: { padding: 16, paddingBottom: 40 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
        marginTop: 30,
    },
    headerButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 26, fontWeight: '700', color: '#7A1F1F' },
    field: { marginBottom: 22 },
    label: { fontSize: 12, fontWeight: '700', color: '#4B5563', letterSpacing: 0.6, marginBottom: 8 },
    input: {
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1F2937',
    },
    inputError: { borderColor: '#B91C1C' },
    errorHint: { fontSize: 12, color: '#B91C1C', marginTop: 6 },
    textArea: { minHeight: 120 },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 16,
        padding: 4,
    },
    segmentOption: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    segmentOptionActive: { backgroundColor: '#3F6B34' },
    segmentOptionInactive: { backgroundColor: '#8B1E1E' },
    segmentText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
    segmentTextActive: { color: 'white' },
    button: {
        marginTop: 20,
        height: 58,
        borderRadius: 16,
        backgroundColor: '#7A1F1F',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#7A1F1F',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: { color: 'white', fontSize: 17, fontWeight: '700', marginLeft: 8 },
});