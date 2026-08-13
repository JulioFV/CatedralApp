import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Search } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
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
import { getItems, getItemsByLocation } from '../api/services/itemService';
import ItemCard from '../components/ItemCard';
import LocationFilterBar, { LocationOption } from '../components/LocationFilterBar';
import { Item } from '../models/Item';
import { Lugar } from '../models/Lugar';

const TODOS_ID = 0; // sentinel: ningún id_lugar real usará 0

export default function ItemsScreen() {
  const router = useRouter();

  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [areas, setAreas] = useState<Lugar[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const [loadingAreas, setLoadingAreas] = useState<boolean>(true);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1) Al montar la pantalla: cargar ubicaciones y seleccionar la primera automáticamente
  useEffect(() => {
    const loadAreas = async (): Promise<void> => {
      try {
        setLoadingAreas(true);
        setErrorMsg(null);
        const result = await getAreas();

        if (result.success) {
          setAreas(result.data);
          // La primera ubicación obtenida de la API queda seleccionada por defecto
          setSelectedLocation(result.data.length > 0 ? result.data[0].id_lugar : TODOS_ID);
        }
      } catch (error) {
        const apiError = error as ApiError;
        setErrorMsg(apiError.mensaje ?? 'No se pudieron cargar las ubicaciones');
        setSelectedLocation(TODOS_ID); // si fallan las áreas, al menos mostramos todos los artículos
      } finally {
        setLoadingAreas(false);
      }
    };

    loadAreas();
  }, []);

  // 2) Cada vez que cambia la ubicación seleccionada: pedir los artículos correspondientes
  useEffect(() => {
    if (selectedLocation === null) return; // aún no se determina la ubicación inicial

    const loadItems = async (): Promise<void> => {
      try {
        setLoadingItems(true);
        setErrorMsg(null);

        const result =
          selectedLocation === TODOS_ID
            ? await getItems()
            : await getItemsByLocation(selectedLocation);

        if (result.status === 'success') {
          setItems(result.data);
        }
      } catch (error) {
        const apiError = error as ApiError;
        setErrorMsg(apiError.mensaje ?? 'No se pudieron cargar los artículos');
      } finally {
        setLoadingItems(false);
      }
    };

    loadItems();
  }, [selectedLocation]);

  // Ubicaciones dinámicas + "Todos" siempre al final
  const locationOptions: LocationOption[] = useMemo(() => {
    const areaOptions: LocationOption[] = areas.map((area) => ({
      id: area.id_lugar,
      code: area.codigo,
      name: area.nombre,
    }));

    return [...areaOptions, { id: TODOS_ID, code: 'TOD', name: 'Todos' }];
  }, [areas]);

  // El filtro de texto se aplica sobre lo que ya devolvió el servidor para la ubicación elegida
  const filteredItems = items.filter(
    (item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo.toLowerCase().includes(search.toLowerCase())
  );

  const handleBack = (): void => {
    router.back();
  };

  const handleAdd = (): void => {
    router.push('/CreateItem');
  };

  const handleOpen = (item: Item): void => {
    router.push({
      pathname: '/ItemDetail',
      params: {
        itemId: item.id_item.toString(),
        itemData: JSON.stringify(item),
      },
    });
  };

  const handleEdit = (item: Item): void => {
    router.push({
      pathname: '/CreateItem',
      params: {
        id_item: item.id_item.toString(),
        itemData: JSON.stringify(item),
      },
    });
  };

  const isLoading = loadingAreas || loadingItems;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <ArrowLeft size={24} color="#555" />
        </TouchableOpacity>

        <Text style={styles.title}>Artículos</Text>

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

      {!loadingAreas && (
        <LocationFilterBar
          locations={locationOptions}
          selectedId={selectedLocation ?? TODOS_ID}
          onSelect={setSelectedLocation}
        />
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#7A1F1F" style={styles.loader} />
      ) : errorMsg ? (
        <View style={styles.centerMessage}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id_item.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerMessage}>
              <Text style={styles.emptyText}>No se encontraron artículos</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ItemCard
              title={item.nombre}
              subtitle={`${item.codigo} • ${item.lugar}`}
              onPress={() => handleOpen(item)}
              onEdit={() => handleEdit(item)}
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