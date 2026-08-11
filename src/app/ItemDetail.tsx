import { Item } from '@/models/Item';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    CircleOff,
    Package,
} from 'lucide-react-native';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ItemDetail() {
    const router = useRouter();
    // Datos de ejemplo
    const item: Item = {
        areaCode: 'ALT',
        objectCode: '001',
        name: 'Cáliz de Plata',
        material: 'Plata',
        quantity: 1,
        status: 'DISPONIBLE',
        location: 'Altar Mayor',
        description: 'Cáliz principal utilizado durante las celebraciones solemnes y festividades litúrgicas.',
        notes: 'Revisar el pulido cada seis meses y mantener en vitrina cuando no esté en uso.',
        id: ''
    };

    const handleBack = () => {
        router.back();
    };

    const handleDisable = () => {
        console.log('Inhabilitar artículo');
        // Aquí puedes mostrar una confirmación antes de cambiar el estado
    };

    return (<SafeAreaView style={styles.container}> <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
    >
        {/* Encabezado */} <View style={styles.header}> <TouchableOpacity
            onPress={handleBack}
            style={styles.headerButton}
        > <ArrowLeft size={22} color='#555' /> </TouchableOpacity>

            <Text style={styles.title}>Detalle del Artículo</Text>

            <View style={styles.headerButton} />
        </View>

        {/* Tarjeta principal */}
        <View style={styles.heroCard}>
            <View style={styles.iconContainer}>
                <Package size={28} color='#C9A44C' />
            </View>

            <View style={styles.heroInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCode}>
                    {item.areaCode}-{item.objectCode}
                </Text>
            </View>

            <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
        </View>

        {/* Información general */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Información General</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Código de área</Text>
                <Text style={styles.value}>{item.areaCode}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Código de objeto</Text>
                <Text style={styles.value}>{item.objectCode}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Material</Text>
                <Text style={styles.value}>{item.material}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Cantidad</Text>
                <Text style={styles.value}>{item.quantity}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Ubicación</Text>
                <Text style={styles.value}>{item.location}</Text>
            </View>
        </View>

        {/* Descripción */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.paragraph}>
                {item.description}
            </Text>
        </View>

        {/* Observaciones */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <Text style={styles.paragraph}>
                {item.notes}
            </Text>
        </View>

        {/* Botón de inhabilitar */}
        <TouchableOpacity
            style={styles.disableButton}
            activeOpacity={0.85}
            onPress={handleDisable}
        >
            <CircleOff size={20} color='white' />
            <Text style={styles.disableButtonText}>
                Inhabilitar Artículo
            </Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
            El artículo permanecerá registrado en el sistema,
            pero dejará de estar disponible para préstamos o
            asignaciones.
        </Text>
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

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,

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
        backgroundColor: '#E9E6D5',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#C9C4B5',
    },

    statusText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#55624A',
        letterSpacing: 0.5,
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

    paragraph: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
    },

    disableButton: {
        marginTop: 10,
        height: 58,
        borderRadius: 16,
        backgroundColor: '#8B1E1E',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#8B1E1E',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 5,

    },

    disableButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '700',
        marginLeft: 8,
    },

    footerNote: {
        marginTop: 14,
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
    },
});
