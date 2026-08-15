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
import { getPrestamos } from '../api/services/loanService';
import ItemLoan from '../components/ItemLoan';
import StatusFilterBar, { StatusOption } from '../components/StatusFilterBar';
import { Prestamo } from '../models/Prestamo';

const TODOS_ID = 0;
const ACTIVO_ID = 1;
const DEVUELTO_ID = 2;

const statusOptions: StatusOption[] = [
  { id: TODOS_ID, label: 'Todos' },
  { id: ACTIVO_ID, label: 'Activos' },
  { id: DEVUELTO_ID, label: 'Inactivos' },
];

type LoanStatus = 'ACTIVO' | 'DEVUELTO' | 'VENCIDO' | undefined;

const mapEstatusToLabel = (estatus: number): LoanStatus => {
  if (estatus === ACTIVO_ID) return 'ACTIVO';
  if (estatus === DEVUELTO_ID) return 'DEVUELTO';
  return undefined;
};

export default function LoansScreen() {
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<number>(TODOS_ID);

  const [loans, setLoans] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loadLoans = async (): Promise<void> => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const result = await getPrestamos();

        if (!result.error) {
          setLoans(result.contenido);
        }
      } catch (error) {
        const apiError = error as ApiError;
        setErrorMsg(apiError.mensaje ?? 'No se pudieron cargar los préstamos');
      } finally {
        setLoading(false);
      }
    };

    loadLoans();
  }, []);

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.nombre_solicitante.toLowerCase().includes(search.toLowerCase()) ||
      loan.item.toLowerCase().includes(search.toLowerCase()) ||
      loan.codigo_item.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === TODOS_ID || loan.estatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleBack = (): void => {
    router.back();
  };

  const handleAdd = (): void => {
    router.push('/CreateLoan');
  };

  const handleOpen = (loan: Prestamo): void => {
    router.push({
      pathname: '/LoanDetail',
      params: {
        loanId: loan.id_prestamo.toString(),
        loanData: JSON.stringify(loan),
      },
    });
  };

  const handleEdit = (loan: Prestamo): void => {
    router.push({
      pathname: '/CreateLoan',
      params: {
        id_prestamo: loan.id_prestamo.toString(),
        loanData: JSON.stringify(loan),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <ArrowLeft size={24} color="#555" />
        </TouchableOpacity>

        <Text style={styles.title}>Préstamos</Text>

        <TouchableOpacity onPress={handleAdd} style={styles.headerButton}>
          <Plus size={24} color="#C9A44C" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por artículo o solicitante..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.statusContainer}>
        <StatusFilterBar
          options={statusOptions}
          selectedId={selectedStatus}
          onSelect={setSelectedStatus}
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
          data={filteredLoans}
          keyExtractor={(loan) => loan.id_prestamo.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerMessage}>
              <Text style={styles.emptyText}>No se encontraron préstamos</Text>
            </View>
          }
          renderItem={({ item: loan }) => (
            <ItemLoan
              itemName={loan.item}
              borrower={loan.nombre_solicitante}
              date={loan.fecha_prestamo}
              status={mapEstatusToLabel(loan.estatus)}
              onPress={() => handleOpen(loan)}
              onDetails={() => handleEdit(loan)}
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
  statusContainer: {
    height: 55, // <-- Altura estática (puedes ajustarla según tu diseño)
    width: '100%', // <-- Ocupa todo el espacio horizontal disponible
    paddingHorizontal: 16, // Opcional: Mantiene la alineación visual con la barra de búsqueda
    marginBottom: 10,
    justifyContent: 'center', // Centra el contenido verticalmente
  },
});