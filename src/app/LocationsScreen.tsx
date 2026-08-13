import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ApiError } from '../api/axiosClient';
import { getAreas } from '../api/services/areaService';
import ItemLocation from '../components/ItemLocation';
import { Lugar } from '../models/Lugar';

export default function LocationsScreen() {
  const [search, setSearch] = useState<string>('');
  const [locations, setLocations] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadLocations = async (): Promise<void> => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const result = await getAreas();
        if (result.success) {
          setLocations(result.data);
        }
      } catch (error) {
        const apiError = error as ApiError;
        setErrorMsg(apiError.mensaje ?? 'No se pudieron cargar las ubicaciones');
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  const filteredLocations = locations.filter(
    (location) =>
      location.nombre.toLowerCase().includes(search.toLowerCase()) ||
      location.codigo.toLowerCase().includes(search.toLowerCase())
  );

  const handleBack = (): void => {
    router.back();
  };

  // Sin parámetros => CreateLocation entra en modo "crear"
  const handleAdd = (): void => {
    router.push('/CreateLocation');
  };

  // Pendiente de definir — ver opciones más abajo
const handleOpen = (location: Lugar): void => {
    router.push({
        pathname: '/LocationDetail',
        params: {
            id_lugar: location.id_lugar.toString(),
            locationData: JSON.stringify(location),
        },
    });
};

  // Misma pantalla de creación, pero con id + datos => modo "editar"
  const handleEdit = (location: Lugar): void => {
    router.push({
      pathname: '/CreateLocation',
      params: {
        id_lugar: location.id_lugar.toString(),
        locationData: JSON.stringify(location),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <ArrowLeft size={24} color="#555" />
        </TouchableOpacity>

        <Text style={styles.title}>Ubicaciones</Text>

        <TouchableOpacity onPress={handleAdd} style={styles.headerButton}>
          <Plus size={24} color="#C9A44C" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o código..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#7A1F1F" style={styles.loader} />
      ) : errorMsg ? (
        <View style={styles.centerMessage}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredLocations}
          keyExtractor={(location) => location.id_lugar.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerMessage}>
              <Text style={styles.emptyText}>No se encontraron ubicaciones</Text>
            </View>
          }
          renderItem={({ item: location }) => (
            <ItemLocation
              name={location.nombre}
              code={location.codigo}
              description={location.referencia}
              manager={location.responsable}
              onPress={() => handleOpen(location)}
              onEdit={() => handleEdit(location)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    marginTop: 30,
  },
  headerButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#7A1F1F',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F7F4',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDDAD4',
    paddingHorizontal: 14,
    height: 52,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1F2937',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  loader: {
    marginTop: 40,
  },
  centerMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 15,
    textAlign: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 15,
    textAlign: 'center',
  },
});