import { useRouter } from 'expo-router';
import { Archive, Calendar, LogOut, MapPin, Package, Users } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ApiError } from '../api/axiosClient';
import { getGeneralStats } from '../api/services/generalService';
import MenuCard from '../components/MenuCard';
import { getNombre } from '../session';
import { GeneralStats } from '../types/general';

const sections = [
    {
        id: 'Items',
        title: 'Artículos',
        icon: Package,
        desc: 'Gestión de objetos',
        color: '#6B1F1F',
        screen: '/ItemsScreen',
    },
    {
        id: 'Locations',
        title: 'Ubicaciones',
        icon: MapPin,
        desc: 'Gestión de espacios',
        color: '#C9A44C',
        screen: '/LocationsScreen',
    },
    {
        id: 'Loans',
        title: 'Préstamos',
        icon: Calendar,
        desc: 'Salidas y retornos',
        color: '#4A5D3A',
        screen: '/LoansScreen',
    },
    {
        id: 'Users',
        title: 'Usuarios',
        icon: Users,
        desc: 'Administración',
        color: '#5A5A5A',
        screen: '/UsersScreen',
    },
    {
        id: 'Uses',
        title: 'Usos de Artículos',
        icon: Archive,
        desc: 'Categorias de uso',
        color: '#6B1F1F',
        screen: '/UsesScreen',
    },
    {
        id:'Login',
        title:'Cerrar Sesion',
        icon: LogOut,
        desc:'Cerrar sesion',
        color:'#780606',
        screen: '/LoginScreen'
    },
] as const;

export default function MainMenuScreen() {
    const router = useRouter();
    const [stats, setStats] = useState<GeneralStats | null>(null);
    const [loadingStats, setLoadingStats] = useState<boolean>(true);

    useEffect(() => {
        const loadStats = async (): Promise<void> => {
            try {
                const result = await getGeneralStats();
                if (result.success && result.data.length > 0) {
                    setStats(result.data[0]);
                }
            } catch (error) {
                const apiError = error as ApiError;
                console.error('Error al obtener estadísticas:', apiError.mensaje ?? error);
            } finally {
                setLoadingStats(false);
            }
        };

        loadStats();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Bienvenido {getNombre()}</Text>
                <Text style={styles.subtitle}>Resumen de inventario</Text>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Catedral</Text>
                    <Text style={styles.summarySubtitle}>Estado general del inventario</Text>
                    <View style={styles.divider} />

                    {loadingStats ? (
                        <ActivityIndicator size="small" color="#7A1F1F" style={styles.loader} />
                    ) : (
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Artículos</Text>
                                <Text style={styles.statValue}>{stats?.tot_items ?? 0}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Préstamos</Text>
                                <Text style={styles.statValue}>{stats?.tot_prestamos ?? 0}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Ubicaciones</Text>
                                <Text style={styles.statValue}>{stats?.tot_lugares ?? 0}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
            <FlatList
                data={sections}
                numColumns={2}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <MenuCard
                        title={item.title}
                        description={item.desc}
                        icon={item.icon}
                        color={item.color}
                        onPress={() => router.push(item.screen)}
                    />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F4F0',
    },
    header: {
        backgroundColor: '#F1F0EC',
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 32,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        borderWidth: 1,
        borderColor: '#E2E0DB',
    },
    welcome: {
        fontSize: 34,
        fontWeight: '600',
        color: '#7A1F1F',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    summaryCard: {
        backgroundColor: '#F8F7F4',
        borderRadius: 22,
        padding: 18,
        borderWidth: 1,
        borderColor: '#E1DED8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#7A1F1F',
    },
    summarySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E3DE',
        marginVertical: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
    },
    loader: {
        paddingVertical: 12,
    },
    listContent: {
        padding: 16,
        paddingBottom: 120,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
});