import { ApiError } from '@/api/axiosClient';
import { getItemsByLocation } from '@/api/services/itemService';
import { Item } from '@/models/Item';
import { Lugar } from '@/models/Lugar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Package, Pencil } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';

import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LocationDetail() {
    const router = useRouter();
    const { locationData } = useLocalSearchParams<{ id_lugar?: string; locationData?: string }>();

    // Antes: const location: Lugar | null = locationData ? JSON.parse(locationData) : null;
    const location: Lugar | null = useMemo(
        () => (locationData ? JSON.parse(locationData) : null),
        [locationData]
    );

    const [items, setItems] = useState<Item[]>([]);
    const [loadingItems, setLoadingItems] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!location) return;

        const loadItems = async (): Promise<void> => {
            try {
                setLoadingItems(true);
                setErrorMsg(null);
                const result = await getItemsByLocation(location.id_lugar);
                if (result.status === 'success') {
                    setItems(result.data);
                }
            } catch (error) {
                const apiError = error as ApiError;
                setErrorMsg(apiError.mensaje ?? 'No se pudieron cargar los artículos de esta ubicación');
            } finally {
                setLoadingItems(false);
            }
        };

        loadItems();
    }, [location]);

    const handleBack = (): void => {
        router.back();
    };

    const handleEdit = (): void => {
        if (!location) return;
        router.push({
            pathname: '/CreateLocation',
            params: {
                id_lugar: location.id_lugar.toString(),
                locationData: JSON.stringify(location),
            },
        });
    };

    const handleOpenItem = (item: Item): void => {
        router.push({
            pathname: '/ItemDetail',
            params: {
                itemId: item.id_item.toString(),
                itemData: JSON.stringify(item),
            },
        });
    };

    if (!location) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                        <ArrowLeft size={22} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Detalle de Ubicación</Text>
                    <View style={styles.headerButton} />
                </View>
                <View style={styles.centerMessage}>
                    <Text style={styles.errorText}>No se encontró información de la ubicación</Text>
                </View>
            </SafeAreaView>
        );
    }

    const activosCount = items.filter((i) => i.activo === 1).length;
    const prestadosCount = items.reduce((sum, i) => sum + i.cantidad_prestada, 0);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                        <ArrowLeft size={22} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Detalle de Ubicación</Text>
                    <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
                        <Pencil size={20} color="#C9A44C" />
                    </TouchableOpacity>
                </View>

                {/* Tarjeta principal */}
                <View style={styles.heroCard}>
                    <View style={styles.iconContainer}>
                        <MapPin size={28} color="#C9A44C" />
                    </View>

                    <View style={styles.heroInfo}>
                        <Text style={styles.locationName}>{location.nombre}</Text>
                        <Text style={styles.locationCode}>{location.codigo}</Text>
                    </View>
                </View>

                {/* Información general */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Información General</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Código</Text>
                        <Text style={styles.value}>{location.codigo}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Referencia</Text>
                        <Text style={styles.value}>{location.referencia || '—'}</Text>
                    </View>

                    <View style={[styles.row, { borderBottomWidth: 0 }]}>
                        <Text style={styles.label}>Responsable</Text>
                        <Text style={styles.value}>{location.responsable || '—'}</Text>
                    </View>
                </View>

                {/* Observaciones */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Observaciones</Text>
                    <Text style={styles.paragraph}>
                        {location.observaciones || 'Sin observaciones registradas.'}
                    </Text>
                </View>

                {/* Resumen de artículos */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Artículos en esta ubicación</Text>

                    {loadingItems ? (
                        <ActivityIndicator size="small" color="#7A1F1F" style={styles.itemsLoader} />
                    ) : errorMsg ? (
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    ) : items.length === 0 ? (
                        <Text style={styles.emptyText}>No hay artículos registrados aquí todavía.</Text>
                    ) : (
                        <>
                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{items.length}</Text>
                                    <Text style={styles.statLabel}>Total</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{activosCount}</Text>
                                    <Text style={styles.statLabel}>Activos</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{prestadosCount}</Text>
                                    <Text style={styles.statLabel}>Prestados</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            {items.map((item) => (
                                <TouchableOpacity
                                    key={item.id_item}
                                    style={styles.itemRow}
                                    onPress={() => handleOpenItem(item)}
                                    activeOpacity={0.75}
                                >
                                    <View style={styles.itemIconContainer}>
                                        <Package size={18} color="#C9A44C" />
                                    </View>
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName} numberOfLines={1}>
                                            {item.nombre}
                                        </Text>
                                        <Text style={styles.itemCode}>{item.codigo}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                </View>

                <TouchableOpacity style={styles.editButton} activeOpacity={0.85} onPress={handleEdit}>
                    <Pencil size={20} color="white" />
                    <Text style={styles.editButtonText}>Editar Ubicación</Text>
                </TouchableOpacity>
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
    title: { fontSize: 22, fontWeight: '700', color: '#7A1F1F' },
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
    locationName: { fontSize: 22, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
    locationCode: { fontSize: 14, color: '#6B7280' },
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
    itemsLoader: { marginVertical: 10 },
    emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingVertical: 10 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    statItem: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: 22, fontWeight: '700', color: '#7A1F1F' },
    statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    divider: { height: 1, backgroundColor: '#E5E3DE', marginVertical: 16 },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E3DE',
    },
    itemIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F1EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
    itemCode: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    editButton: {
        marginTop: 10,
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
    editButtonText: { color: 'white', fontSize: 17, fontWeight: '700', marginLeft: 8 },
    centerMessage: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    errorText: { color: '#B91C1C', fontSize: 15, textAlign: 'center' },
});