import { ApiError } from '@/api/axiosClient';
import { AreaPayload, createArea, updateArea } from '@/api/services/areaService';
import { Lugar } from '@/models/Lugar';
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

export default function CreateLocation() {
    const router = useRouter();
    const { id_lugar, locationData } = useLocalSearchParams<{
        id_lugar?: string;
        locationData?: string;
    }>();

    const isEditMode = !!id_lugar;

    // useMemo evita crear un objeto nuevo en cada render (mismo fix que aplicamos en LocationDetail)
    const parsedLocation: Lugar | null = useMemo(
        () => (locationData ? JSON.parse(locationData) : null),
        [locationData]
    );

    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [reference, setReference] = useState<string>('');
    const [responsable, setResponsable] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Modo edición: prellenar el formulario con los datos recibidos
    useEffect(() => {
        if (!parsedLocation) return;

        setCode(parsedLocation.codigo);
        setName(parsedLocation.nombre);
        setReference(parsedLocation.referencia ?? '');
        setResponsable(parsedLocation.responsable ?? '');
        setNotes(parsedLocation.observaciones ?? '');
    }, [parsedLocation]);

    const handleBack = (): void => {
        router.back();
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!code.trim()) newErrors.code = 'El código es obligatorio';
        if (!name.trim()) newErrors.name = 'El nombre es obligatorio';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (): Promise<void> => {
        if (!validate()) return;

        const payload: AreaPayload = {
            nombre: name.trim(),
            referencia: reference.trim(),
            responsable: responsable.trim(),
            observaciones: notes.trim(),
            codigo: code.trim().toUpperCase(),
        };

        try {
            setSubmitting(true);

            const result =
                isEditMode && parsedLocation
                    ? await updateArea(parsedLocation.id_lugar, payload)
                    : await createArea(payload);

            if (result.success) {
                Alert.alert('Éxito', result.message, [
                    { text: 'Aceptar', onPress: () => router.back() },
                ]);
            } else {
                const esCodigoDuplicado = result.message?.toLowerCase().includes('duplicate entry');
                Alert.alert(
                    'No se pudo guardar',
                    esCodigoDuplicado
                        ? `Ya existe una ubicación con el código "${payload.codigo}". Cambia el código e intenta de nuevo.`
                        : result.message
                );
            }
        } catch (error) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.mensaje || 'Ocurrió un error al guardar la ubicación');
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

                        <Text style={styles.title}>
                            {isEditMode ? 'Editar Ubicación' : 'Nueva Ubicación'}
                        </Text>

                        <View style={styles.headerButton} />
                    </View>

                    {/* Código de área */}
                    <View style={styles.field}>
                        <Text style={styles.label}>CÓDIGO DE ÁREA</Text>
                        <TextInput
                            style={[styles.input, errors.code && styles.inputError]}
                            placeholder="Ej: SAC"
                            placeholderTextColor="#A1A1AA"
                            autoCapitalize="characters"
                            value={code}
                            onChangeText={setCode}
                        />
                        {errors.code ? <Text style={styles.errorHint}>{errors.code}</Text> : null}
                    </View>

                    {/* Nombre general */}
                    <View style={styles.field}>
                        <Text style={styles.label}>NOMBRE GENERAL</Text>
                        <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            placeholder="Ej: Sacristía"
                            placeholderTextColor="#A1A1AA"
                            value={name}
                            onChangeText={setName}
                        />
                        {errors.name ? <Text style={styles.errorHint}>{errors.name}</Text> : null}
                    </View>

                    {/* Ubicación de referencia */}
                    <View style={styles.field}>
                        <Text style={styles.label}>UBICACIÓN DE REFERENCIA</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Planta baja, junto al presbiterio"
                            placeholderTextColor="#A1A1AA"
                            value={reference}
                            onChangeText={setReference}
                        />
                    </View>

                    {/* Responsable (texto libre) */}
                    <View style={styles.field}>
                        <Text style={styles.label}>RESPONSABLE</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Sr. Gustavo Palacios"
                            placeholderTextColor="#A1A1AA"
                            value={responsable}
                            onChangeText={setResponsable}
                        />
                    </View>

                    {/* Observaciones */}
                    <View style={styles.field}>
                        <Text style={styles.label}>OBSERVACIONES</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Notas..."
                            placeholderTextColor="#A1A1AA"
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={notes}
                            onChangeText={setNotes}
                        />
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
                                    {isEditMode ? 'Guardar Cambios' : 'Registrar Ubicación'}
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
    container: {
        flex: 1,
        backgroundColor: '#F5F4F0',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
        marginTop: 30,
    },
    headerButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#7A1F1F',
    },
    field: {
        marginBottom: 22,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4B5563',
        letterSpacing: 0.6,
        marginBottom: 8,
    },
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
    inputError: {
        borderColor: '#B91C1C',
    },
    errorHint: {
        fontSize: 12,
        color: '#B91C1C',
        marginTop: 6,
    },
    textArea: {
        minHeight: 120,
    },
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
    buttonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '700',
        marginLeft: 8,
    },
});