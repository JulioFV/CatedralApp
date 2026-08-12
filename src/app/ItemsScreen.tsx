import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Search } from 'lucide-react-native';
import { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ItemCard from '../components/ItemCard'; // Ajusta la ruta según tu proyecto
import { Item } from '../models/Item'; // Asegúrate de tener un tipo definido para los artículos

const initialItems = [
  {
    id: '1',
    title: 'Cáliz de Plata',
    subtitle: 'OBJ-001 • Altar Mayor',
  },
  {
    id: '2',
    title: 'Custodia Dorada',
    subtitle: 'OBJ-002 • Capilla del Sagrario',
  },
  {
    id: '3',
    title: 'Candelabro Bronce',
    subtitle: 'OBJ-003 • Nave Central',
  },
  {
    id: '4',
    title: 'Incensario Antiguo',
    subtitle: 'OBJ-004 • Sacristía',
  },
];

export default function ItemsScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filteredItems = initialItems.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleBack = () => {
    router.back();
  };

  const handleAdd = () => {
    router.push("/CreateItem");
  };

  const handleOpen = (ITEM: Item) => {
    router.push({
      pathname: '/ItemDetail',
      params: { itemId: ITEM.id },
    });
  };

  const handleEdit = (id: string) => {
    console.log('Editar artículo', id);
  };

  return (<SafeAreaView style={styles.container}>
    {/* Encabezado */} <View style={styles.header}> <TouchableOpacity onPress={handleBack} style={styles.headerButton}> <ArrowLeft size={24} color='#555' /> </TouchableOpacity>

      <Text style={styles.title}>Artículos</Text>

      <TouchableOpacity onPress={handleAdd} style={styles.headerButton}>
        <Plus size={24} color='#C9A44C' />
      </TouchableOpacity>
    </View>

    {/* Buscador */}
    <View style={styles.searchContainer}>
      <Search size={20} color='#9CA3AF' />
      <TextInput
        style={styles.searchInput}
        placeholder='Buscar por nombre o código...'
        placeholderTextColor='#9CA3AF'
        value={search}
        onChangeText={setSearch}
      />
    </View>

    {/* Lista */}
    <FlatList
      data={filteredItems}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <ItemCard
          title={item.title}
          subtitle={item.subtitle}
          onPress={() => handleOpen(item as unknown as Item)}
          onEdit={() => handleEdit(item.id)}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    marginTop:30,
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
    paddingBottom: 120, // espacio para la futura barra de navegación
  },
});
