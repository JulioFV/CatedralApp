import { ApiError } from '@/api/axiosClient';
import {
    getIdByEmail,
    getPreguntaUsuario,
    updatePassword,
    validarPreguntaRespuesta,
} from '@/api/services/recoveryService';
import { validarUsuario } from '@/api/services/securityService';
import { CustomAlert as Alert } from '@/components/CustomAlert';
import { Pregunta } from '@/models/Pregunta';
import { useRouter } from 'expo-router';
import { ArrowLeft, KeyRound, Lock, Mail, ShieldQuestion } from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
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

type Step = 'email' | 'question' | 'newPassword';

export default function RecoverPassword() {
    const router = useRouter();

    const [step, setStep] = useState<Step>('email');

    // Paso 1: correo
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [checkingEmail, setCheckingEmail] = useState<boolean>(false);

    const [idUsuario, setIdUsuario] = useState<number | null>(null);

    // Paso 2: pregunta de seguridad
    const [pregunta, setPregunta] = useState<Pregunta | null>(null);
    const [respuesta, setRespuesta] = useState<string>('');
    const [respuestaError, setRespuestaError] = useState<string | null>(null);
    const [validatingAnswer, setValidatingAnswer] = useState<boolean>(false);

    // Paso 3: nueva contraseña
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
    const [submittingPassword, setSubmittingPassword] = useState<boolean>(false);

    const handleBack = (): void => {
        router.back();
    };

    // --- Paso 1: buscar correo -> validar si tiene pregunta -> obtener pregunta ---
    const handleSubmitEmail = async (): Promise<void> => {
        if (!email.trim()) {
            setEmailError('El correo es obligatorio');
            return;
        }

        try {
            setCheckingEmail(true);
            setEmailError(null);

            const idRes = await getIdByEmail(email.trim());
            if (!idRes.success || !idRes.data) {
                setEmailError(idRes.message ?? 'No se pudo verificar el correo ingresado');
                return;
            }

            const id = Number(idRes.data);
            setIdUsuario(id);

            const validaRes = await validarUsuario(id);
            if (validaRes.contenido !== true) {
                Alert.alert(
                    'No es posible continuar',
                    'Tu cuenta no tiene una pregunta de seguridad registrada. Comunícate con un administrador para restablecer tu contraseña.',
                    [{ text: 'Entendido', onPress: () => router.replace('/LoginScreen') }]
                );
                return;
            }

            const preguntaRes = await getPreguntaUsuario(id);
            if (preguntaRes.error || preguntaRes.contenido === false) {
                Alert.alert(
                    'No es posible continuar',
                    'No se encontró una pregunta de seguridad asociada a tu cuenta. Comunícate con un administrador.',
                    [{ text: 'Entendido', onPress: () => router.replace('/LoginScreen') }]
                );
                return;
            }

            setPregunta(preguntaRes.contenido);
            setStep('question');
        } catch (error) {
            const apiError = error as ApiError;
            setEmailError(apiError.mensaje ?? 'Ocurrió un error al verificar el correo');
        } finally {
            setCheckingEmail(false);
        }
    };

    // --- Paso 2: validar respuesta ---
    const handleValidateAnswer = async (): Promise<void> => {
        if (!respuesta.trim()) {
            setRespuestaError('Escribe tu respuesta');
            return;
        }
        if (!idUsuario || !pregunta) return;

        try {
            setValidatingAnswer(true);
            setRespuestaError(null);

            const result = await validarPreguntaRespuesta({
                id_usuario: idUsuario,
                id_pregunta: pregunta.id_pregunta,
                respuesta: respuesta.trim(),
            });

            if (!result.error && result.contenido === true) {
                setStep('newPassword');
            } else {
                setRespuestaError(result.mensaje);
            }
        } catch (error) {
            const apiError = error as ApiError;
            setRespuestaError(apiError.mensaje ?? 'Ocurrió un error al validar tu respuesta');
        } finally {
            setValidatingAnswer(false);
        }
    };

    // --- Paso 3: restablecer contraseña ---
    const validatePasswordFields = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!newPassword.trim()) {
            newErrors.newPassword = 'La contraseña es obligatoria';
        } else if (newPassword.length < 4) {
            newErrors.newPassword = 'Debe tener al menos 4 caracteres';
        }

        if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setPasswordErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleResetPassword = async (): Promise<void> => {
        if (!validatePasswordFields()) return;
        if (!idUsuario) return;

        try {
            setSubmittingPassword(true);

            const result = await updatePassword({ id_usuario: idUsuario, password: newPassword });

            if (result.success) {
                Alert.alert('Contraseña actualizada', result.message, [
                    { text: 'Ir a iniciar sesión', onPress: () => router.replace('/LoginScreen') },
                ]);
            } else {
                Alert.alert('No se pudo actualizar', result.message);
            }
        } catch (error) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.mensaje || 'Ocurrió un error al restablecer la contraseña');
        } finally {
            setSubmittingPassword(false);
        }
    };

    const stepTitles: Record<Step, string> = {
        email: 'Recuperar Contraseña',
        question: 'Pregunta de Seguridad',
        newPassword: 'Nueva Contraseña',
    };

    const stepNumbers: Record<Step, string> = {
        email: 'Paso 1 de 3',
        question: 'Paso 2 de 3',
        newPassword: 'Paso 3 de 3',
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                            <ArrowLeft size={22} color="#555" />
                        </TouchableOpacity>
                        <Text style={styles.title}>{stepTitles[step]}</Text>
                        <View style={styles.headerButton} />
                    </View>

                    <Text style={styles.stepIndicator}>{stepNumbers[step]}</Text>

                    {/* PASO 1: correo */}
                    {step === 'email' && (
                        <>
                            <View style={styles.iconCircle}>
                                <Mail size={28} color="#C9A44C" />
                            </View>
                            <Text style={styles.stepDescription}>
                                Ingresa el correo con el que iniciaste sesión. Verificaremos tu cuenta y
                                te haremos una pregunta de seguridad.
                            </Text>

                            <View style={styles.field}>
                                <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                                <TextInput
                                    style={[styles.input, emailError && styles.inputError]}
                                    placeholder="ejemplo@catedral.com"
                                    placeholderTextColor="#A1A1AA"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                {emailError ? <Text style={styles.errorHint}>{emailError}</Text> : null}
                            </View>

                            <TouchableOpacity
                                style={styles.button}
                                activeOpacity={0.85}
                                onPress={handleSubmitEmail}
                                disabled={checkingEmail}
                            >
                                {checkingEmail ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.buttonText}>Continuar</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    {/* PASO 2: pregunta de seguridad */}
                    {step === 'question' && pregunta && (
                        <>
                            <View style={styles.iconCircle}>
                                <ShieldQuestion size={28} color="#C9A44C" />
                            </View>
                            <Text style={styles.stepDescription}>Responde tu pregunta de seguridad:</Text>

                            <View style={styles.questionCard}>
                                <Text style={styles.questionText}>{pregunta.descripcion}</Text>
                            </View>

                            <View style={styles.field}>
                                <Text style={styles.label}>TU RESPUESTA</Text>
                                <TextInput
                                    style={[styles.input, respuestaError && styles.inputError]}
                                    placeholder="Escribe tu respuesta"
                                    placeholderTextColor="#A1A1AA"
                                    value={respuesta}
                                    onChangeText={setRespuesta}
                                />
                                {respuestaError ? <Text style={styles.errorHint}>{respuestaError}</Text> : null}
                            </View>

                            <TouchableOpacity
                                style={styles.button}
                                activeOpacity={0.85}
                                onPress={handleValidateAnswer}
                                disabled={validatingAnswer}
                            >
                                {validatingAnswer ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.buttonText}>Validar Respuesta</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    {/* PASO 3: nueva contraseña */}
                    {step === 'newPassword' && (
                        <>
                            <View style={styles.iconCircle}>
                                <Lock size={28} color="#C9A44C" />
                            </View>
                            <Text style={styles.stepDescription}>
                                Ingresa tu nueva contraseña. Úsala la próxima vez que inicies sesión.
                            </Text>

                            <View style={styles.field}>
                                <Text style={styles.label}>NUEVA CONTRASEÑA</Text>
                                <TextInput
                                    style={[styles.input, passwordErrors.newPassword && styles.inputError]}
                                    placeholder="Ingresa una contraseña"
                                    placeholderTextColor="#A1A1AA"
                                    secureTextEntry
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                {passwordErrors.newPassword ? (
                                    <Text style={styles.errorHint}>{passwordErrors.newPassword}</Text>
                                ) : null}
                            </View>

                            <View style={styles.field}>
                                <Text style={styles.label}>CONFIRMAR CONTRASEÑA</Text>
                                <TextInput
                                    style={[styles.input, passwordErrors.confirmPassword && styles.inputError]}
                                    placeholder="Repite la contraseña"
                                    placeholderTextColor="#A1A1AA"
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                {passwordErrors.confirmPassword ? (
                                    <Text style={styles.errorHint}>{passwordErrors.confirmPassword}</Text>
                                ) : null}
                            </View>

                            <TouchableOpacity
                                style={styles.button}
                                activeOpacity={0.85}
                                onPress={handleResetPassword}
                                disabled={submittingPassword}
                            >
                                {submittingPassword ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <>
                                        <KeyRound size={20} color="white" />
                                        <Text style={styles.buttonText}>Restablecer Contraseña</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </>
                    )}
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
        marginBottom: 8,
        marginTop: 30,
    },
    headerButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: '700', color: '#7A1F1F' },
    stepIndicator: {
        fontSize: 12,
        fontWeight: '700',
        color: '#C9A44C',
        letterSpacing: 0.6,
        textAlign: 'center',
        marginBottom: 20,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#EFEEE9',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    stepDescription: {
        fontSize: 14,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    questionCard: {
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    questionText: { fontSize: 16, fontWeight: '600', color: '#1F2937', textAlign: 'center' },
    field: { marginBottom: 20 },
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
    button: {
        marginTop: 8,
        height: 56,
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
    buttonText: { color: 'white', fontSize: 16, fontWeight: '700', marginLeft: 8 },
});