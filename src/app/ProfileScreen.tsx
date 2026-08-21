import { getRoles } from '@/api/services/rolService';
import { validarUsuario } from '@/api/services/securityService';
import SecurityQuestionModal from '@/components/SecurityQuestionModal';
import { getApp, getEmail, getIdRol, getIdUsuario, getNombre } from '@/session';
import { useRouter } from 'expo-router';
import { AlertTriangle, ArrowLeft, Mail, Shield, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();

    const idUsuario = getIdUsuario();
    const nombre = getNombre();
    const email = getEmail();
    const apellido = getApp();
    const idRol = getIdRol();

    const [rolNombre, setRolNombre] = useState<string>('');
    const [loadingRol, setLoadingRol] = useState<boolean>(true);

    const [tieneRespuesta, setTieneRespuesta] = useState<boolean | null>(null);
    const [loadingRespuesta, setLoadingRespuesta] = useState<boolean>(true);

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        const loadRol = async (): Promise<void> => {
            try {
                setLoadingRol(true);
                const result = await getRoles();
                if (!result.error) {
                    const rol = result.contenido.find((r) => r.id_rol === idRol);
                    setRolNombre(rol?.nombre ?? '');
                }
            } catch (error) {
                // No crítico: si falla, simplemente no se muestra el rol
            } finally {
                setLoadingRol(false);
            }
        };

        const checkRespuestaRegistrada = async (): Promise<void> => {
            if (!idUsuario) return;
            try {
                setLoadingRespuesta(true);
                const result = await validarUsuario(idUsuario);
                // contenido es `true` cuando ya tiene respuesta, o `[]` cuando no
                setTieneRespuesta(result.contenido === true);
            } catch (error) {
                // Si falla la verificación, no mostramos la etiqueta hasta poder confirmarlo
                setTieneRespuesta(null);
            } finally {
                setLoadingRespuesta(false);
            }
        };

        loadRol();
        checkRespuestaRegistrada();
    }, [idUsuario, idRol]);

    const handleBack = (): void => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                        <ArrowLeft size={22} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Mi Perfil</Text>
                    <View style={styles.headerButton} />
                </View>

                {/* Tarjeta principal */}
                <View style={styles.heroCard}>
                    <View style={styles.avatarContainer}>
                        <User size={32} color="#C9A44C" />
                    </View>
                    <Text style={styles.userName}>{nombre}</Text>
                    {loadingRol ? (
                        <ActivityIndicator size="small" color="#7A1F1F" />
                    ) : rolNombre ? (
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleBadgeText}>{rolNombre}</Text>
                        </View>
                    ) : null}
                </View>

                {/* Información general */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Información General</Text>

                    <View style={styles.infoRow}>
                        <User size={18} color="#6B7280" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Nombre completo</Text>
                            <Text style={styles.infoValue}>
                                {nombre} {apellido}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Mail size={18} color="#6B7280" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Correo electrónico</Text>
                            <Text style={styles.infoValue}>{email}</Text>
                        </View>
                    </View>

                    <View style={[styles.infoRow, { marginBottom: 0 }]}>
                        <Shield size={18} color="#6B7280" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Rol</Text>
                            <Text style={styles.infoValue}>{rolNombre || '—'}</Text>
                        </View>
                    </View>
                </View>

                {/* Etiqueta de pregunta de seguridad pendiente */}
                {!loadingRespuesta && tieneRespuesta === false && (
                    <TouchableOpacity
                        style={styles.securityBanner}
                        activeOpacity={0.85}
                        onPress={() => setModalVisible(true)}
                    >
                        <AlertTriangle size={20} color="#8B5E00" />
                        <View style={styles.securityBannerTextContainer}>
                            <Text style={styles.securityBannerTitle}>
                                No tienes una pregunta de seguridad registrada
                            </Text>
                            <Text style={styles.securityBannerSubtitle}>
                                Sin ella, no podrás restablecer tu contraseña si la olvidas. Toca aquí
                                para registrarla.
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {idUsuario && (
                <SecurityQuestionModal
                    visible={modalVisible}
                    id_usuario={idUsuario}
                    onClose={() => setModalVisible(false)}
                    onRegistered={() => setTieneRespuesta(true)}
                />
            )}
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
        marginBottom: 24,
        marginTop: 30,
    },
    headerButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: '700', color: '#7A1F1F' },
    heroCard: {
        backgroundColor: '#F8F7F4',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D9D7D2',
        padding: 24,
        alignItems: 'center',
        marginBottom: 18,
    },
    avatarContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#EFEEE9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    userName: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
    roleBadge: {
        backgroundColor: '#E9E6D5',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#C9C4B5',
    },
    roleBadgeText: { fontSize: 12, fontWeight: '700', color: '#55624A', letterSpacing: 0.5 },
    card: {
        backgroundColor: '#F8F7F4',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#D9D7D2',
        padding: 18,
        marginBottom: 18,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 14 },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
    infoTextContainer: { marginLeft: 12, flex: 1 },
    infoLabel: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
    infoValue: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
    securityBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FBF0DC',
        borderWidth: 1,
        borderColor: '#E0B667',
        borderRadius: 16,
        padding: 14,
    },
    securityBannerTextContainer: { marginLeft: 12, flex: 1 },
    securityBannerTitle: { fontSize: 14, fontWeight: '700', color: '#8B5E00' },
    securityBannerSubtitle: { fontSize: 12, color: '#8B5E00', marginTop: 3, lineHeight: 17 },
});