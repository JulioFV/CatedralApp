import { ApiError } from '@/api/axiosClient';
import { getRoles } from '@/api/services/rolService';
import { createUser, updateUser, UserPayload } from '@/api/services/userService';
import LocationFilterBar, { LocationOption } from '@/components/LocationFilterBar';
import { Rol } from '@/models/Rol';
import { Usuario } from '@/models/Usuario';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react-native';
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

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// Código corto SOLO visual para los chips de rol — no se envía al servidor
const codeFromNombre = (nombre: string): string =>
    nombre.length <= 4 ? nombre.toUpperCase() : nombre.substring(0, 3).toUpperCase();

export default function CreateUser() {
    const router = useRouter();
    const { id_usuario, userData } = useLocalSearchParams<{
        id_usuario?: string;
        userData?: string;
    }>();

    const isEditMode = !!id_usuario;

    const parsedUser: Usuario | null = useMemo(
        () => (userData ? JSON.parse(userData) : null),
        [userData]
    );

    const [roles, setRoles] = useState<Rol[]>([]);
    const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
    const [catalogError, setCatalogError] = useState<string | null>(null);

    const [nombre, setNombre] = useState<string>('');
    const [apellido, setApellido] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const loadRoles = async (): Promise<void> => {
            try {
                setLoadingRoles(true);
                setCatalogError(null);
                const result = await getRoles();
                if (!result.error) {
                    setRoles(result.contenido);
                }
            } catch (error) {
                const apiError = error as ApiError;
                setCatalogError(apiError.mensaje ?? 'No se pudieron cargar los roles');
            } finally {
                setLoadingRoles(false);
            }
        };

        loadRoles();
    }, []);

    useEffect(() => {
        if (!parsedUser || loadingRoles) return;

        setNombre(parsedUser.nombre);
        setApellido(parsedUser.app);
        setEmail(parsedUser.email);
        setPassword(parsedUser.password);

        const matchedRole = roles.find(
            (r) => r.nombre.toLowerCase() === parsedUser.nombreRol.toLowerCase()
        );
        setSelectedRoleId(matchedRole ? matchedRole.id_rol : null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingRoles, parsedUser]);

    const handleBack = (): void => {
        router.back();
    };

    const roleOptions: LocationOption[] = roles.map((r) => ({
        id: r.id_rol,
        code: codeFromNombre(r.nombre),
        name: r.nombre,
    }));

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        if (!apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';

        if (!email.trim()) {
            newErrors.email = 'El correo es obligatorio';
        } else if (!EMAIL_REGEX.test(email.trim())) {
            newErrors.email = 'Ingresa un correo válido';
        }

        if (!password.trim()) newErrors.password = 'La contraseña es obligatoria';
        if (!selectedRoleId) newErrors.role = 'Selecciona un rol';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (): Promise<void> => {
        if (!validate()) return;
        if (!selectedRoleId) return;

        const payload: UserPayload = {
            nombre: nombre.trim(),
            app: apellido.trim(),
            email: email.trim(),
            password: password,
            id_rol: selectedRoleId,
        };

        try {
            setSubmitting(true);

            const result =
                isEditMode && parsedUser
                    ? await updateUser(parsedUser.id_usuario, {
                        ...payload,
                        id_usuario: parsedUser.id_usuario,
                    })
                    : await createUser(payload);

            if (result.success) {
                Alert.alert('Éxito', result.message, [
                    { text: 'Aceptar', onPress: () => router.back() },
                ]);
            } else {
                Alert.alert('No se pudo guardar', result.message);
            }
        } catch (error) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.mensaje || 'Ocurrió un error al guardar el usuario');
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingRoles) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerMessage}>
                    <ActivityIndicator size="large" color="#7A1F1F" />
                </View>
            </SafeAreaView>
        );
    }

    if (catalogError) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                        <ArrowLeft size={22} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</Text>
                    <View style={styles.headerButton} />
                </View>
                <View style={styles.centerMessage}>
                    <Text style={styles.errorText}>{catalogError}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                            <ArrowLeft size={22} color="#555" />
                        </TouchableOpacity>

                        <Text style={styles.title}>{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</Text>

                        <View style={styles.headerButton} />
                    </View>

                    {/* Nombre */}
                    <View style={styles.field}>
                        <Text style={styles.label}>NOMBRE</Text>
                        <TextInput
                            style={[styles.input, errors.nombre && styles.inputError]}
                            placeholder="Ej: Juan"
                            placeholderTextColor="#A1A1AA"
                            value={nombre}
                            onChangeText={setNombre}
                        />
                        {errors.nombre ? <Text style={styles.errorHint}>{errors.nombre}</Text> : null}
                    </View>

                    {/* Apellido */}
                    <View style={styles.field}>
                        <Text style={styles.label}>APELLIDO(S)</Text>
                        <TextInput
                            style={[styles.input, errors.apellido && styles.inputError]}
                            placeholder="Ej: Pérez García"
                            placeholderTextColor="#A1A1AA"
                            value={apellido}
                            onChangeText={setApellido}
                        />
                        {errors.apellido ? <Text style={styles.errorHint}>{errors.apellido}</Text> : null}
                    </View>

                    {/* Correo */}
                    <View style={styles.field}>
                        <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            placeholder="ejemplo@catedral.com"
                            placeholderTextColor="#A1A1AA"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                        {errors.email ? <Text style={styles.errorHint}>{errors.email}</Text> : null}
                    </View>

                    {/* Rol */}
                    <Text style={styles.label}>ROL</Text>
                    <LocationFilterBar
                        locations={roleOptions}
                        selectedId={selectedRoleId ?? -1}
                        onSelect={(id) => {
                            setSelectedRoleId(id);
                            setErrors((prev) => ({ ...prev, role: '' }));
                        }}
                    />
                    {errors.role ? <Text style={styles.errorHint}>{errors.role}</Text> : null}

                    {/* Contraseña */}
                    <View style={styles.field}>
                        <Text style={styles.label}>CONTRASEÑA</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.passwordInput, errors.password && styles.inputError]}
                                placeholder="Ingresa una contraseña"
                                placeholderTextColor="#A1A1AA"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} color="#6B7280" />
                                ) : (
                                    <Eye size={20} color="#6B7280" />
                                )}
                            </TouchableOpacity>
                        </View>
                        {errors.password ? <Text style={styles.errorHint}>{errors.password}</Text> : null}
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
                                    {isEditMode ? 'Guardar Cambios' : 'Registrar Usuario'}
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
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    passwordInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#1F2937' },
    eyeButton: { paddingLeft: 10 },
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
    centerMessage: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    errorText: { color: '#B91C1C', fontSize: 15, textAlign: 'center' },
});