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
import ItemUses from '../components/ItemUses'; // Ajusta la ruta según tu proyecto

type UseStatus = 'ACTIVO' | 'INACTIVO';

type Use = {
  id: string;
  nombre: string;
  descripcion: string;
  estado: UseStatus;
};

const initialUses: Use[] = [
  {
    id: '1',
    nombre: 'Liturgico',
    descripcion: 'Encargado de la liturgia y ceremonias religiosas',
    estado: 'ACTIVO',
  },
  {
    id: '2',
    nombre: 'Sacristia',
    descripcion: 'Encargado de la sacristía y preparación de los elementos litúrgicos',
    estado: 'INACTIVO',
  }
];

export default function UsersScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filteredUses = initialUses.filter(
    (use) =>
      use.nombre.toLowerCase().includes(search.toLowerCase()) ||
      use.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const handleBack = () => {
    router.back();
  };

  const handleAdd = () => {
    router.push('/CreateUse');
  };

  const handleOpen = (id: string) => {
    console.log('Abrir ubicación', id);
  };

  const handleEdit = (id: string) => {
    console.log('Editar ubicación', id);
  };

  return (<SafeAreaView style={styles.container}>
    {/* Encabezado */} <View style={styles.header}> <TouchableOpacity onPress={handleBack} style={styles.headerButton}> <ArrowLeft size={24} color='#555' /> </TouchableOpacity>

      <Text style={styles.title}>Usos</Text>

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
      data={filteredUses}
      keyExtractor={(use) => use.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item: use }) => (
        <ItemUses
          title={use.nombre}
          description={use.descripcion}
          status={use.estado}
          onPress={() => handleOpen(use.id)}
          onEdit={() => handleEdit(use.id)}
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
