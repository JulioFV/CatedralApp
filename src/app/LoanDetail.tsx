import { ApiError } from '@/api/axiosClient';
import { returnLoan } from '@/api/services/loanService';
import { Prestamo } from '@/models/Prestamo';
import { ESTATUS_DEVUELTO, mapEstatusToLabel } from '@/utils/loanStatus';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Calendar,
    CircleCheck,
    Phone,
    Shield,
    User,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoanDetail() {
    const router = useRouter();
    const { loanData } = useLocalSearchParams<{ loanId?: string; loanData?: string }>();

    const parsedLoan: Prestamo | null = useMemo(
        () => (loanData ? JSON.parse(loanData) : null),
        [loanData]
    );

    const [loan, setLoan] = useState<Prestamo | null>(parsedLoan);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleBack = (): void => {
        router.back();
    };

    const handleReturn = (): void => {
        if (!loan) return;

        Alert.alert(
            '¿Registrar devolución?',
            `Se marcará el préstamo de "${loan.item}" como devuelto.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: async () => {
                        try {
                            setSubmitting(true);
                            const result = await returnLoan(loan.id_prestamo);

                            if (!result.error) {
                                // El servidor no regresa el préstamo actualizado, solo un mensaje;
                                // reflejamos el cambio localmente para no recargar toda la pantalla.
                                setLoan({
                                    ...loan,
                                    estatus: ESTATUS_DEVUELTO,
                                    fecha_devolucion: new Date().toISOString(),
                                });
                                Alert.alert('Listo', typeof result.contenido === 'string'
                                    ? result.contenido
                                    : result.mensaje);
                            } else {
                                Alert.alert('No se pudo registrar la devolución', result.mensaje);
                            }
                        } catch (error) {
                            const apiError = error as ApiError;
                            Alert.alert('Error de conexión', apiError.mensaje || 'Intenta de nuevo');
                        } finally {
                            setSubmitting(false);
                        }
                    },
                },
            ]
        );
    };

    if (!loan) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                        <ArrowLeft size={22} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Detalle del Préstamo</Text>
                    <View style={styles.headerButton} />
                </View>
                <View style={styles.centerMessage}>
                    <Text style={styles.errorText}>No se encontró información del préstamo</Text>
                </View>
            </SafeAreaView>
        );
    }

    const statusLabel = mapEstatusToLabel(loan.estatus);
    const isActivo = statusLabel === 'ACTIVO';
    const esUsuarioRegistrado = loan.id_usuario !== null;

    const statusStyle = isActivo ? styles.activeBadge : styles.returnedBadge;
    const statusTextStyle = isActivo ? styles.activeText : styles.returnedText;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={true}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                        <ArrowLeft size={22} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Detalle del Préstamo</Text>
                    <View style={styles.headerButton} />
                </View>

                {/* Tarjeta principal */}
                <View style={styles.heroCard}>
                    <View style={styles.iconContainer}>
                        <Calendar size={28} color="#C9A44C" />
                    </View>

                    <View style={styles.heroInfo}>
                        <Text style={styles.itemName}>{loan.item}</Text>
                        <Text style={styles.itemCode}>{loan.codigo_item}</Text>
                    </View>

                    <View style={[styles.statusBadge, statusStyle]}>
                        <Text style={[styles.statusText, statusTextStyle]}>
                            {statusLabel ?? 'DESCONOCIDO'}
                        </Text>
                    </View>
                </View>

                {/* Información del préstamo */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Información del Préstamo</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Artículo</Text>
                        <Text style={styles.value}>{loan.item}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Código</Text>
                        <Text style={styles.value}>{loan.codigo_item}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Cantidad</Text>
                        <Text style={styles.value}>{loan.cantidad}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Fecha de préstamo</Text>
                        <Text style={styles.value}>{loan.fecha_prestamo}</Text>
                    </View>

                    <View style={[styles.row, { borderBottomWidth: 0 }]}>
                        <Text style={styles.label}>Fecha de devolución</Text>
                        <Text style={styles.value}>{loan.fecha_devolucion || 'Pendiente'}</Text>
                    </View>
                </View>

                {/* Solicitante */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Solicitante</Text>

                    <View style={styles.infoRow}>
                        <User size={18} color="#6B7280" />
                        <Text style={styles.infoText}>
                            {esUsuarioRegistrado ? loan.usuario : loan.nombre_solicitante}
                        </Text>
                    </View>

                    {!esUsuarioRegistrado && (
                        <View style={styles.infoRow}>
                            <Phone size={18} color="#6B7280" />
                            <Text style={styles.infoText}>{loan.telefono_solicitante}</Text>
                        </View>
                    )}

                    <Text style={styles.smallText}>
                        {esUsuarioRegistrado ? 'Usuario registrado en el sistema' : 'Solicitante externo'}
                    </Text>
                </View>

                {/* Garantía */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Garantía</Text>
                    <View style={styles.infoRow}>
                        <Shield size={18} color="#6B7280" />
                        <Text style={styles.infoText}>{loan.garantia}</Text>
                    </View>
                </View>

                {/* Observaciones */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Observaciones</Text>
                    <Text style={styles.paragraph}>
                        {loan.observaciones || 'Sin observaciones registradas.'}
                    </Text>
                </View>

                {/* Botón de devolución */}
                {isActivo && (
                    <TouchableOpacity
                        style={styles.returnButton}
                        activeOpacity={0.85}
                        onPress={handleReturn}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <CircleCheck size={20} color="white" />
                                <Text style={styles.returnButtonText}>Registrar Devolución</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </ScrollView>
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
    title: { fontSize: 26, fontWeight: '700', color: '#7A1F1F' },
    heroCard: {
        backgroundColor: '#F8F7F4',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D9D7D2',
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 22,
    },
    iconContainer: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#EFEEE9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    heroInfo: { flex: 1 },
    itemName: { fontSize: 22, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
    itemCode: { fontSize: 14, color: '#6B7280' },
    statusBadge: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
    statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
    activeBadge: { backgroundColor: '#E9E6D5', borderColor: '#C9C4B5' },
    activeText: { color: '#55624A' },
    returnedBadge: { backgroundColor: '#DCEAD7', borderColor: '#B8D2B2' },
    returnedText: { color: '#355E3B' },
    card: {
        backgroundColor: '#F8F7F4',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#D9D7D2',
        padding: 18,
        marginBottom: 18,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 14 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E3DE',
    },
    label: { fontSize: 14, color: '#6B7280' },
    value: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    infoText: { marginLeft: 10, fontSize: 15, color: '#1F2937', fontWeight: '500' },
    smallText: { fontSize: 13, color: '#6B7280', marginTop: 4 },
    paragraph: { fontSize: 15, color: '#4B5563', lineHeight: 22 },
    returnButton: {
        marginTop: 10,
        height: 58,
        borderRadius: 16,
        backgroundColor: '#4A5D3A',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4A5D3A',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 5,
    },
    returnButtonText: { color: 'white', fontSize: 17, fontWeight: '700', marginLeft: 8 },
    centerMessage: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    errorText: { color: '#B91C1C', fontSize: 15, textAlign: 'center' },
});