import { ApiError } from '@/api/axiosClient';
import { updateItemStatus } from '@/api/services/itemService';
import { CustomAlert as Alert } from '@/components/CustomAlert';
import { Item } from '@/models/Item';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    CircleCheck,
    CircleOff,
    Package,
} from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ItemDetail() {
    const router = useRouter();
    const { itemData } = useLocalSearchParams<{ itemId?: string; itemData?: string }>();

    const parsedItem: Item | null = itemData ? JSON.parse(itemData) : null;
    const [item, setItem] = useState<Item | null>(parsedItem);
    const [updating, setUpdating] = useState<boolean>(false);

    const handleBack = (): void => {
        router.back();
    };

    const formatFecha = (fecha: string): string => {
        try {
            const date = new Date(fecha.replace(' ', 'T'));
            return date.toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            });
        } catch {
            return fecha;
        }
    };

    const handleToggleStatus = (): void => {
        if (!item) return;

        const nuevoEstado = item.activo === 1 ? 0 : 1;
        const accion = nuevoEstado === 0 ? 'inhabilitar' : 'habilitar';

        Alert.alert(
            `¿${accion === 'inhabilitar' ? 'Inhabilitar' : 'Habilitar'} artículo?`,
            `El artículo dejará de estar disponible para préstamos o asignaciones.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    style: nuevoEstado === 0 ? 'destructive' : 'default',
                    onPress: async () => {
                        try {
                            setUpdating(true);
                            const result = await updateItemStatus(item.id_item, nuevoEstado);
                            if (result.status === 'success') {
                                setItem({ ...item, activo: nuevoEstado });
                            } else {
                                Alert.alert('Error', result.message || 'No se pudo actualizar el estado');
                            }
                        } catch (error) {
                            const apiError = error as ApiError;
                            Alert.alert('Error de conexión', apiError.mensaje || 'Intenta de nuevo');
                        } finally {
                            setUpdating(false);
                        }
                    },
                },
            ]
        );
    };

    if (!item) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                        <ArrowLeft size={22} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Detalle del Artículo</Text>
                    <View style={styles.headerButton} />
                </View>
                <View style={styles.centerMessage}>
                    <Text style={styles.errorText}>No se encontró información del artículo</Text>
                </View>
            </SafeAreaView>
        );
    }

    const isActivo = item.activo === 1;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={true}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                        <ArrowLeft size={22} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Detalle del Artículo</Text>
                    <View style={styles.headerButton} />
                </View>

                {/* Tarjeta principal */}
                <View style={styles.heroCard}>
                    <View style={styles.iconContainer}>
                        <Package size={28} color="#C9A44C" />
                    </View>

                    <View style={styles.heroInfo}>
                        <Text style={styles.itemName}>{item.nombre}</Text>
                        <Text style={styles.itemCode}>{item.codigo}</Text>
                    </View>

                    <View
                        style={[
                            styles.statusBadge,
                            isActivo ? styles.statusBadgeActive : styles.statusBadgeInactive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                isActivo ? styles.statusTextActive : styles.statusTextInactive,
                            ]}
                        >
                            {isActivo ? 'ACTIVO' : 'INACTIVO'}
                        </Text>
                    </View>
                </View>

                {/* Información general */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Información General</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Código</Text>
                        <Text style={styles.value}>{item.codigo}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Material</Text>
                        <Text style={styles.value}>{item.material}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Cantidad</Text>
                        <Text style={styles.value}>{item.cantidad}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Cantidad prestada</Text>
                        <Text style={styles.value}>{item.cantidad_prestada}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Ubicación</Text>
                        <Text style={styles.value}>
                            {item.lugar} ({item.codigo_lugar})
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Estado físico</Text>
                        <Text style={styles.value}>{item.estado}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Uso</Text>
                        <Text style={styles.value}>{item.uso}</Text>
                    </View>

                    <View style={[styles.row, { borderBottomWidth: 0 }]}>
                        <Text style={styles.label}>Fecha de registro</Text>
                        <Text style={styles.value}>{formatFecha(item.fecha_creacion)}</Text>
                    </View>
                </View>

                {/* Descripción */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Descripción</Text>
                    <Text style={styles.paragraph}>
                        {item.descripcion || 'Sin descripción registrada.'}
                    </Text>
                </View>

                {/* Observaciones */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Observaciones</Text>
                    <Text style={styles.paragraph}>
                        {item.observaciones || 'Sin observaciones registradas.'}
                    </Text>
                </View>

                {/* Botón de inhabilitar / habilitar */}
                <TouchableOpacity
                    style={[styles.disableButton, !isActivo && styles.enableButton]}
                    activeOpacity={0.85}
                    onPress={handleToggleStatus}
                    disabled={updating}
                >
                    {updating ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <>
                            {isActivo ? (
                                <CircleOff size={20} color="white" />
                            ) : (
                                <CircleCheck size={20} color="white" />
                            )}
                            <Text style={styles.disableButtonText}>
                                {isActivo ? 'Inhabilitar Artículo' : 'Habilitar Artículo'}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                <Text style={styles.footerNote}>
                    {isActivo
                        ? 'El artículo permanecerá registrado en el sistema, pero dejará de estar disponible para préstamos o asignaciones.'
                        : 'El artículo volverá a estar disponible para préstamos y asignaciones.'}
                </Text>
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
    heroInfo: { flex: 1 },
    itemName: { fontSize: 22, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
    itemCode: { fontSize: 14, color: '#6B7280' },
    statusBadge: {
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
    },
    statusBadgeActive: { backgroundColor: '#E4EFE1', borderColor: '#B7D4AE' },
    statusBadgeInactive: { backgroundColor: '#F1E1E1', borderColor: '#D9B3B3' },
    statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
    statusTextActive: { color: '#3F6B34' },
    statusTextInactive: { color: '#8B1E1E' },
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
    paragraph: { fontSize: 15, color: '#4B5563', lineHeight: 22 },
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
    enableButton: {
        backgroundColor: '#3F6B34',
        shadowColor: '#3F6B34',
    },
    disableButtonText: { color: 'white', fontSize: 17, fontWeight: '700', marginLeft: 8 },
    footerNote: { marginTop: 14, fontSize: 12, color: '#6B7280', textAlign: 'center', lineHeight: 18 },
    centerMessage: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 20 },
    errorText: { color: '#B91C1C', fontSize: 15, textAlign: 'center' },
});