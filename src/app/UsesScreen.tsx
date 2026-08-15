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
import { getUsos } from '../api/services/usoService';
import ItemUses from '../components/ItemUses';
import { Uso } from '../models/Uso';

type UseStatus = 'ACTIVO' | 'INACTIVO';

const ESTADO_ACTIVO = 1;
const ESTADO_INACTIVO = 2;

const mapEstadoToLabel = (estado: number): UseStatus => {
  return estado === ESTADO_ACTIVO ? 'ACTIVO' : 'INACTIVO';
};

export default function UsesScreen() {
  const [search, setSearch] = useState<string>('');
  const [usos, setUsos] = useState<Uso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUsos = async (): Promise<void> => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const result = await getUsos();
        if (!result.error) {
          setUsos(result.contenido);
        }
      } catch (error) {
        const apiError = error as ApiError;
        setErrorMsg(apiError.mensaje ?? 'No se pudieron cargar los usos');
      } finally {
        setLoading(false);
      }
    };

    loadUsos();
  }, []);

  const filteredUses = usos.filter(
    (use) =>
      use.nombre.toLowerCase().includes(search.toLowerCase()) ||
      use.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const handleBack = (): void => {
    router.back();
  };

  const handleAdd = (): void => {
    router.push('/CreateUse');
  };

  const handleOpen = (use: Uso): void => {
    console.log('Abrir uso', use.id_uso);
  };

  const handleEdit = (use: Uso): void => {
    router.push({
      pathname: '/CreateUse',
      params: {
        id_uso: use.id_uso.toString(),
        usoData: JSON.stringify(use),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <ArrowLeft size={24} color="#555" />
        </TouchableOpacity>

        <Text style={styles.title}>Usos</Text>

        <TouchableOpacity onPress={handleAdd} style={styles.headerButton}>
          <Plus size={24} color="#C9A44C" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o descripción..."
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
          data={filteredUses}
          keyExtractor={(use) => use.id_uso.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerMessage}>
              <Text style={styles.emptyText}>No se encontraron usos</Text>
            </View>
          }
          renderItem={({ item: use }) => (
            <ItemUses
              title={use.nombre}
              description={use.descripcion}
              status={mapEstadoToLabel(use.estado)}
              onPress={() => handleOpen(use)}
              onEdit={() => handleEdit(use)}
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