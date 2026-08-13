import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Calendar,
    CircleCheck,
    Phone,
    Shield,
    User,
} from 'lucide-react-native';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Loan } from '../models/Loan'; // Ajusta la ruta

export default function LoanDetail() {
    const router = useRouter();
    const { loan } = useLocalSearchParams();

    const loanData: Loan = JSON.parse(loan as string);

    const handleReturn = () => {
        console.log('Registrar devolución', loanData.id);
        // Aquí después llamarás a tu API:
        // PUT /loans/{id}/return
    };

    const statusStyle =
        loanData.status === 'ACTIVO'
            ? styles.activeBadge
            : loanData.status === 'DEVUELTO'
                ? styles.returnedBadge
                : styles.overdueBadge;

    const statusTextStyle =
        loanData.status === 'ACTIVO'
            ? styles.activeText
            : loanData.status === 'DEVUELTO'
                ? styles.returnedText
                : styles.overdueText;

    return (<SafeAreaView style={styles.container}> <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
    >
        {/* Encabezado */} <View style={styles.header}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.headerButton}
            > <ArrowLeft size={22} color='#555' /> </TouchableOpacity>

            <Text style={styles.title}>Detalle del Préstamo</Text>

            <View style={styles.headerButton} />
        </View>

        {/* Tarjeta principal */}
        <View style={styles.heroCard}>
            <View style={styles.iconContainer}>
                <Calendar size={28} color='#C9A44C' />
            </View>

            <View style={styles.heroInfo}>
                <Text style={styles.itemName}>
                    {loanData.itemName}
                </Text>
                <Text style={styles.itemCode}>
                    {loanData.itemCode}
                </Text>
            </View>

            <View style={[styles.statusBadge, statusStyle]}>
                <Text
                    style={[styles.statusText, statusTextStyle]}
                >
                    {loanData.status}
                </Text>
            </View>
        </View>

        {/* Información del préstamo */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>
                Información del Préstamo
            </Text>

            <View style={styles.row}>
                <Text style={styles.label}>Artículo</Text>
                <Text style={styles.value}>
                    {loanData.itemName}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Código</Text>
                <Text style={styles.value}>
                    {loanData.itemCode}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Fecha prevista
                </Text>
                <Text style={styles.value}>
                    {loanData.expectedDate}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Fecha real</Text>
                <Text style={styles.value}>
                    {loanData.realDate || 'Pendiente'}
                </Text>
            </View>
        </View>

        {/* Solicitante */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>
                Solicitante
            </Text>

            <View style={styles.infoRow}>
                <User size={18} color='#6B7280' />
                <Text style={styles.infoText}>
                    {loanData.registeredUser
                        ? loanData.userName
                        : loanData.borrowerName}
                </Text>
            </View>

            {!loanData.registeredUser && (
                <View style={styles.infoRow}>
                    <Phone size={18} color='#6B7280' />
                    <Text style={styles.infoText}>
                        {loanData.borrowerPhone}
                    </Text>
                </View>
            )}

            <Text style={styles.smallText}>
                {loanData.registeredUser
                    ? 'Usuario registrado en el sistema'
                    : 'Solicitante externo'}
            </Text>
        </View>

        {/* Garantía */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Garantía</Text>

            <View style={styles.infoRow}>
                <Shield size={18} color='#6B7280' />
                <Text style={styles.infoText}>
                    {loanData.guaranteeType}
                </Text>
            </View>

            <Text style={styles.paragraph}>
                {loanData.guaranteeDescription}
            </Text>
        </View>

        {/* Observaciones */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>
                Observaciones
            </Text>
            <Text style={styles.paragraph}>
                {loanData.notes}
            </Text>
        </View>

        {/* Botón de devolución */}
        {loanData.status === 'ACTIVO' && (
            <TouchableOpacity
                style={styles.returnButton}
                activeOpacity={0.85}
                onPress={handleReturn}
            >
                <CircleCheck size={20} color='white' />
                <Text style={styles.returnButtonText}>
                    Registrar Devolución
                </Text>
            </TouchableOpacity>
        )}
    </ScrollView>
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
        marginBottom: 24,
        marginTop:30,
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

    heroInfo: {
        flex: 1,
    },

    itemName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },

    itemCode: {
        fontSize: 14,
        color: '#6B7280',
    },

    statusBadge: {
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
    },

    statusText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    activeBadge: {
        backgroundColor: '#E9E6D5',
        borderColor: '#C9C4B5',
    },

    activeText: {
        color: '#55624A',
    },

    returnedBadge: {
        backgroundColor: '#DCEAD7',
        borderColor: '#B8D2B2',
    },

    returnedText: {
        color: '#355E3B',
    },

    overdueBadge: {
        backgroundColor: '#F5D6D6',
        borderColor: '#D8B8B8',
    },

    overdueText: {
        color: '#8B1E1E',
    },

    card: {
        backgroundColor: '#F8F7F4',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#D9D7D2',
        padding: 18,
        marginBottom: 18,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 14,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E3DE',
    },

    label: {
        fontSize: 14,
        color: '#6B7280',
    },

    value: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    infoText: {
        marginLeft: 10,
        fontSize: 15,
        color: '#1F2937',
        fontWeight: '500',
    },

    smallText: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },

    paragraph: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
    },

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

    returnButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '700',
        marginLeft: 8,
    },
});
