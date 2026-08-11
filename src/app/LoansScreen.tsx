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
import ItemLoan from '../components/ItemLoan'; // Ajusta la ruta según tu proyecto

type LoanStatus = 'ACTIVO' | 'DEVUELTO' | 'VENCIDO' | undefined;


type Loan = {
  id: string;
  nombre: string;
  solicitante: string;
  fecha: string;
  estado?: LoanStatus;
};

const initialLoans: Loan[] = [
  {
    id: '1',
    nombre: 'Reclinatorio',
    solicitante: 'Sr. Juan Pérez',
    fecha: '2024-06-15',
    estado: 'ACTIVO',

  },
  {
    id: '2',
    nombre: 'Altar Mayor',
    solicitante: 'Sra. María López',
    fecha: '2024-06-10',
    estado: 'DEVUELTO',

  }
];

export default function LoansScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filteredLoans = initialLoans.filter(
    (loan) =>
      loan.nombre.toLowerCase().includes(search.toLowerCase()) ||
      loan.solicitante.toLowerCase().includes(search.toLowerCase())
  );

  const handleBack = () => {
    router.back();
  };

  const handleAdd = () => {
    router.push('/CreateLoan');
  };

  const handleOpen = (id: string) => {
    const loan = initialLoans.find(l => l.id === id);
    if (loan) {
      router.push({
        pathname: '/LoanDetail',
        params: {loan: JSON.stringify(loan),
        },
      });
    }
  };

  const handleEdit = (id: string) => {
    console.log('Editar ubicación', id);
  };

  return (<SafeAreaView style={styles.container}>
    {/* Encabezado */} <View style={styles.header}> <TouchableOpacity onPress={handleBack} style={styles.headerButton}> <ArrowLeft size={24} color='#555' /> </TouchableOpacity>

      <Text style={styles.title}>Préstamos</Text>

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
      data={filteredLoans}
      keyExtractor={(loan) => loan.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item: loan }) => (
        <ItemLoan
          itemName={loan.nombre}
          borrower={loan.solicitante}
          date={loan.fecha}
          status={loan.estado}
          onPress={() => handleOpen(loan.id)}
          onDetails={() => handleEdit(loan.id)}
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

