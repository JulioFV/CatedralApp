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
import { getUsers } from '../api/services/userService';
import ItemUser from '../components/ItemUser';
import { Usuario } from '../models/Usuario';

export default function UsersScreen() {
  const [search, setSearch] = useState<string>('');
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUsers = async (): Promise<void> => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const result = await getUsers();
        if (result.status === 'success') {
          setUsers(result.data);
        }
      } catch (error) {
        const apiError = error as ApiError;
        setErrorMsg(apiError.mensaje ?? 'No se pudieron cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(search.toLowerCase()) ||
      user.app.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.nombreRol.toLowerCase().includes(search.toLowerCase())
  );

  const handleBack = (): void => {
    router.back();
  };

  const handleAdd = (): void => {
    router.push('/CreateUser');
  };

  const handleOpen = (user: Usuario): void => {
    console.log('Abrir usuario', user.id_usuario);
  };

  const handleEdit = (user: Usuario): void => {
    router.push({
      pathname: '/CreateUser',
      params: {
        id_usuario: user.id_usuario.toString(),
        userData: JSON.stringify(user),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <ArrowLeft size={24} color="#555" />
        </TouchableOpacity>

        <Text style={styles.title}>Administrar Usuarios</Text>

        <TouchableOpacity onPress={handleAdd} style={styles.headerButton}>
          <Plus size={24} color="#C9A44C" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, correo o rol..."
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
          data={filteredUsers}
          keyExtractor={(user) => user.id_usuario.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerMessage}>
              <Text style={styles.emptyText}>No se encontraron usuarios</Text>
            </View>
          }
          renderItem={({ item: user }) => (
            <ItemUser
              name={user.nombre}
              apep={user.app}
              apm=""
              role={user.nombreRol}
              onPress={() => handleOpen(user)}
              onEdit={() => handleEdit(user)}
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