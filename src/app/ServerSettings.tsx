import { getAxiosBaseUrl, setAxiosBaseUrl } from '@/api/axiosClient';
import { CustomAlert as Alert } from '@/components/CustomAlert';
import { DEFAULT_URL_BASE } from '@/config';
import { isPinCustomized, setPin, verifyPin } from '@/utils/adminPin';
import {
    clearStoredServerUrl,
    isValidUrl,
    normalizeBaseUrl,
    setStoredServerUrl,
    testServerConnection,
} from '@/utils/serverConfig';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, KeyRound, RotateCcw, Server, XCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
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

export default function ServerSettings() {
    const router = useRouter();

    // --- Puerta de PIN ---
    const [unlocked, setUnlocked] = useState<boolean>(false);
    const [pinInput, setPinInput] = useState<string>('');
    const [pinError, setPinError] = useState<string | null>(null);
    const [pinIsDefault, setPinIsDefault] = useState<boolean>(true);

    useEffect(() => {
        isPinCustomized().then((customized) => setPinIsDefault(!customized));
    }, []);

    const handleUnlock = async (): Promise<void> => {
        const valid = await verifyPin(pinInput);
        if (valid) {
            setUnlocked(true);
            setPinError(null);
        } else {
            setPinError('PIN incorrecto');
        }
    };

    // --- Configuración de URL ---
    const [urlInput, setUrlInput] = useState<string>(getAxiosBaseUrl());
    const [testing, setTesting] = useState<boolean>(false);
    const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    const handleBack = (): void => {
        router.back();
    };

    const handleTestConnection = async (): Promise<void> => {
        if (!isValidUrl(urlInput.trim())) {
            setTestResult({ ok: false, message: 'La URL no tiene un formato válido (debe iniciar con http:// o https://).' });
            return;
        }

        try {
            setTesting(true);
            setTestResult(null);
            const result = await testServerConnection(urlInput.trim());
            setTestResult(result);
        } finally {
            setTesting(false);
        }
    };

    const handleSave = async (): Promise<void> => {
        if (!isValidUrl(urlInput.trim())) {
            Alert.alert('URL inválida', 'Ingresa una URL válida (debe iniciar con http:// o https://).');
            return;
        }

        const normalized = normalizeBaseUrl(urlInput.trim());

        Alert.alert(
            '¿Guardar nueva dirección del servidor?',
            'La app se conectará a esta URL a partir de ahora. Asegúrate de haber probado la conexión antes de continuar.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Guardar',
                    onPress: async () => {
                        try {
                            setSaving(true);
                            await setStoredServerUrl(normalized);
                            setAxiosBaseUrl(normalized);
                            Alert.alert('Guardado', 'La dirección del servidor se actualizó correctamente.', [
                                { text: 'Aceptar', onPress: () => router.back() },
                            ]);
                        } finally {
                            setSaving(false);
                        }
                    },
                },
            ]
        );
    };

    const handleResetDefault = (): void => {
        Alert.alert(
            '¿Restablecer valores por defecto?',
            'Se eliminará la URL personalizada y la app volverá a usar su configuración original.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Restablecer',
                    style: 'destructive',
                    onPress: async () => {
                        await clearStoredServerUrl();
                        setAxiosBaseUrl(DEFAULT_URL_BASE);
                        setUrlInput(DEFAULT_URL_BASE);
                        setTestResult(null);
                        Alert.alert('Listo', 'Se restableció la configuración original.');
                    },
                },
            ]
        );
    };

    // --- Cambio de PIN ---
    const [newPin, setNewPin] = useState<string>('');
    const [confirmPin, setConfirmPin] = useState<string>('');
    const [pinChangeError, setPinChangeError] = useState<string | null>(null);
    const [savingPin, setSavingPin] = useState<boolean>(false);

    const handleChangePin = async (): Promise<void> => {
        if (newPin.length < 4) {
            setPinChangeError('El PIN debe tener al menos 4 dígitos');
            return;
        }
        if (newPin !== confirmPin) {
            setPinChangeError('Los PIN no coinciden');
            return;
        }

        try {
            setSavingPin(true);
            setPinChangeError(null);
            await setPin(newPin);
            setPinIsDefault(false);
            setNewPin('');
            setConfirmPin('');
            Alert.alert('Listo', 'El PIN de configuración se actualizó correctamente.');
        } finally {
            setSavingPin(false);
        }
    };

    // --- Pantalla de bloqueo por PIN ---
    if (!unlocked) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                        <ArrowLeft size={22} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Acceso Restringido</Text>
                    <View style={styles.headerButton} />
                </View>

                <View style={styles.lockContent}>
                    <View style={styles.iconCircle}>
                        <KeyRound size={28} color="#C9A44C" />
                    </View>
                    <Text style={styles.lockDescription}>
                        Esta sección es solo para administradores. Ingresa el PIN de configuración
                        para continuar.
                    </Text>

                    <TextInput
                        style={[styles.pinInput, pinError && styles.inputError]}
                        placeholder="PIN"
                        placeholderTextColor="#A1A1AA"
                        keyboardType="numeric"
                        secureTextEntry
                        value={pinInput}
                        onChangeText={setPinInput}
                        maxLength={8}
                    />
                    {pinError ? <Text style={styles.errorHint}>{pinError}</Text> : null}

                    <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleUnlock}>
                        <Text style={styles.buttonText}>Ingresar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                            <ArrowLeft size={22} color="#555" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Configuración del Servidor</Text>
                        <View style={styles.headerButton} />
                    </View>

                    {pinIsDefault && (
                        <View style={styles.warningBanner}>
                            <Text style={styles.warningBannerText}>
                                ⚠️ Estás usando el PIN por defecto. Cámbialo más abajo antes de salir de
                                esta pantalla.
                            </Text>
                        </View>
                    )}

                    {/* URL del servidor */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Server size={18} color="#7A1F1F" />
                            <Text style={styles.cardTitle}>Dirección del servidor</Text>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="http://192.168.1.50/ApiCatedral/public/"
                            placeholderTextColor="#A1A1AA"
                            autoCapitalize="none"
                            keyboardType="url"
                            value={urlInput}
                            onChangeText={(text) => {
                                setUrlInput(text);
                                setTestResult(null);
                            }}
                        />

                        {testResult && (
                            <View style={[styles.testResult, testResult.ok ? styles.testOk : styles.testFail]}>
                                {testResult.ok ? (
                                    <CheckCircle2 size={16} color="#3F6B34" />
                                ) : (
                                    <XCircle size={16} color="#B91C1C" />
                                )}
                                <Text
                                    style={[
                                        styles.testResultText,
                                        testResult.ok ? styles.testResultTextOk : styles.testResultTextFail,
                                    ]}
                                >
                                    {testResult.message}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={handleTestConnection}
                            activeOpacity={0.8}
                            disabled={testing}
                        >
                            {testing ? (
                                <ActivityIndicator size="small" color="#7A1F1F" />
                            ) : (
                                <Text style={styles.secondaryButtonText}>Probar conexión</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSave}
                            activeOpacity={0.85}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Guardar dirección</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={handleResetDefault}
                            activeOpacity={0.7}
                        >
                            <RotateCcw size={14} color="#6B7280" />
                            <Text style={styles.resetButtonText}>Restablecer valores por defecto</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Cambiar PIN */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <KeyRound size={18} color="#7A1F1F" />
                            <Text style={styles.cardTitle}>Cambiar PIN de acceso</Text>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Nuevo PIN"
                            placeholderTextColor="#A1A1AA"
                            keyboardType="numeric"
                            secureTextEntry
                            value={newPin}
                            onChangeText={setNewPin}
                            maxLength={8}
                        />
                        <TextInput
                            style={[styles.input, { marginTop: 10 }]}
                            placeholder="Confirmar nuevo PIN"
                            placeholderTextColor="#A1A1AA"
                            keyboardType="numeric"
                            secureTextEntry
                            value={confirmPin}
                            onChangeText={setConfirmPin}
                            maxLength={8}
                        />
                        {pinChangeError ? <Text style={styles.errorHint}>{pinChangeError}</Text> : null}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleChangePin}
                            activeOpacity={0.85}
                            disabled={savingPin}
                        >
                            {savingPin ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Actualizar PIN</Text>
                            )}
                        </TouchableOpacity>
                    </View>
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
        marginBottom: 20,
        marginTop: 30,
    },
    headerButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 18, fontWeight: '700', color: '#7A1F1F', flex: 1, textAlign: 'center' },
    lockContent: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 24 },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#EFEEE9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
    },
    lockDescription: { fontSize: 14, color: '#4B5563', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
    pinInput: {
        width: '100%',
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: 4,
        color: '#1F2937',
        marginBottom: 6,
    },
    inputError: { borderColor: '#B91C1C' },
    errorHint: { fontSize: 12, color: '#B91C1C', marginBottom: 10, textAlign: 'center' },
    warningBanner: {
        backgroundColor: '#FBF0DC',
        borderWidth: 1,
        borderColor: '#E0B667',
        borderRadius: 14,
        padding: 12,
        marginBottom: 16,
    },
    warningBannerText: { fontSize: 13, color: '#8B5E00', lineHeight: 18 },
    card: {
        backgroundColor: '#F8F7F4',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#D9D7D2',
        padding: 18,
        marginBottom: 18,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginLeft: 8 },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
    },
    testResult: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
    },
    testOk: { backgroundColor: '#E4EFE1' },
    testFail: { backgroundColor: '#F1E1E1' },
    testResultText: { fontSize: 13, marginLeft: 8, flex: 1 },
    testResultTextOk: { color: '#3F6B34' },
    testResultTextFail: { color: '#8B1E1E' },
    secondaryButton: {
        marginTop: 12,
        height: 46,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D9D7D2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: { fontSize: 14, fontWeight: '600', color: '#7A1F1F' },
    button: {
        margin: 10,
        height: 50,
        borderRadius: 14,
        backgroundColor: '#7A1F1F',
        justifyContent: 'center',
        alignItems: 'center',
        padding:10,
    },
    buttonText: { color: 'white', fontSize: 15, fontWeight: '700' },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingVertical: 6,
    },
    resetButtonText: { fontSize: 12, color: '#6B7280', marginLeft: 6, textDecorationLine: 'underline' },
});