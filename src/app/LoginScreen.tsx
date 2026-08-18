import { CustomAlert as Alert } from '@/components/CustomAlert';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Church, Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ApiError } from "../api/axiosClient";
import { login } from "../api/services/authService";
import { setSession } from "../session";

export default function LoginScreen() {
  const [email, setEmailInput] = useState<string>("f@gmail.com");
  const [password, setPasswordInput] = useState<string>("1234");
  const [loading, setLoading] = useState<boolean>(false);
      const [showPassword, setShowPassword] = useState<boolean>(false);

const router = useRouter();

const validarParametros = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!email?.trim() || !password?.trim()) {
    Alert.alert('ERROR', 'Los campos son obligatorios');
    return;
  }

  if (!emailRegex.test(email.trim())) {
    Alert.alert('Error', 'Correo electrónico no válido');
    return;
  }

  handleLogin();
};
const handleLogin = async (): Promise<void> =>{

  if (!email || !password) {
      Alert.alert("Atención", "Por favor ingresa email y contraseña");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        setSession(result.data);
        console.log("Respuesta del servidor");
        router.push('/MainMenuScreen');
      } else {
        Alert.alert("Error", result.message || "Credenciales incorrectas");
      }
    } catch (error) {
      const apiError = error as ApiError;
      Alert.alert("Error de conexión", apiError.mensaje || "Intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

return ( <SafeAreaView style={styles.container}>
 <View style={styles.logoCard}> <Church size={40} color='#7A1F1F' /> </View>

  <Text style={styles.title}>Catedral</Text>
  <Text style={styles.subtitle}>SISTEMA DE INVENTARIO</Text>

  <View style={styles.inputGroup}>
    <Text style={styles.label}>USUARIO / CORREO</Text>
    <View style={styles.inputContainer}>
      <Church size={20} color='#777' style={styles.icon} />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmailInput}
        placeholder='admin@catedral.com'
        placeholderTextColor='#999'
        keyboardType='email-address'
        autoCapitalize='none'
      />
    </View>
  </View>

  <View style={styles.inputGroup}>
    <Text style={styles.label}>CONTRASEÑA</Text>
    <View style={styles.inputContainer}>
      <Church size={20} color='#777' style={styles.icon} />
      <TextInput
        style={styles.input}
        value={password}
        
        onChangeText={setPasswordInput}
        placeholder='Contraseña'
        placeholderTextColor='#999'
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} color="#6B7280" />
                                ) : (
                                    <Eye size={20} color="#6B7280" />
                                )}
                            </TouchableOpacity>
    </View>
  </View>

  <TouchableOpacity style={styles.button} onPress={validarParametros}>
    <Ionicons name='checkmark' size={20} color='white' />
    <Text style={styles.buttonText}>Ingresar</Text>
    
  </TouchableOpacity>
</SafeAreaView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#F5F4F0',
alignItems: 'center',
justifyContent: 'center',
paddingHorizontal: 24,
},

logoCard: {
width: 90,
height: 90,
borderRadius: 20,
backgroundColor: '#FFFFFF',
justifyContent: 'center',
alignItems: 'center',
marginBottom: 18,

shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.08,
shadowRadius: 8,
elevation: 4,
},

title: {
fontSize: 34,
color: '#7A1F1F',
fontWeight: '600',
marginBottom: 6,
},

subtitle: {
fontSize: 13,
letterSpacing: 2,
color: '#666',
marginBottom: 40,
},

inputGroup: {
width: '100%',
marginBottom: 20,
},

label: {
fontSize: 12,
color: '#444',
fontWeight: '700',
marginBottom: 8,
letterSpacing: 1,
},

inputContainer: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#F8F8F8',
borderWidth: 1,
borderColor: '#D7D5D0',
borderRadius: 14,
paddingHorizontal: 14,
height: 56,
},

icon: {
marginRight: 10,
},

input: {
flex: 1,
fontSize: 16,
color: '#333',
},

button: {
marginTop: 24,
width: '100%',
height: 56,
backgroundColor: '#7A1F1F',
borderRadius: 14,
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',


shadowColor: '#7A1F1F',
shadowOffset: { width: 0, height: 6 },
shadowOpacity: 0.25,
shadowRadius: 8,
elevation: 6,


},
eyeButton: { paddingLeft: 10 },

buttonText: {
color: 'white',
fontSize: 18,
fontWeight: '700',
marginLeft: 8,
},
});
