import { useRouter } from 'expo-router';
import { ArrowLeft, Check, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const roles = [
    'ADMINISTRADOR',
    'SACRISTÁN',
    'PÁRROCO',
    'VOLUNTARIO',
    'SECRETARIA',
];

export default function CreateUser() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [motherLastName, setMotherLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('ADMINISTRADOR');
    const [showRoles, setShowRoles] = useState(false);
    const [password, setPassword] = useState('');
    const router = useRouter();


    const handleBack = () => {
        router.back();
    };

    const handleRegister = () => {
        console.log({
            name,
            lastName,
            motherLastName,
            email,
            role,
            password,
        });
    };

    return (<SafeAreaView style={styles.container}> <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
    >
        {/* Encabezado */} <View style={styles.header}> <TouchableOpacity
            onPress={handleBack}
            style={styles.headerButton}
        > <ArrowLeft size={22} color='#555' /> </TouchableOpacity>

            <Text style={styles.title}>Nuevo Usuario</Text>

            <View style={styles.headerButton} />
        </View>

        {/* Nombre */}
        <View style={styles.field}>
            <Text style={styles.label}>NOMBRE</Text>
            <TextInput
                style={styles.input}
                placeholder='Ej: Juan'
                placeholderTextColor='#A1A1AA'
                value={name}
                onChangeText={setName}
            />
        </View>

        {/* Apellido paterno */}
        <View style={styles.field}>
            <Text style={styles.label}>APELLIDO PATERNO</Text>
            <TextInput
                style={styles.input}
                placeholder='Ej: Pérez'
                placeholderTextColor='#A1A1AA'
                value={lastName}
                onChangeText={setLastName}
            />
        </View>

        {/* Apellido materno */}
        <View style={styles.field}>
            <Text style={styles.label}>APELLIDO MATERNO</Text>
            <TextInput
                style={styles.input}
                placeholder='Ej: García'
                placeholderTextColor='#A1A1AA'
                value={motherLastName}
                onChangeText={setMotherLastName}
            />
        </View>

        {/* Correo */}
        <View style={styles.field}>
            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <TextInput
                style={styles.input}
                placeholder='ejemplo@catedral.com'
                placeholderTextColor='#A1A1AA'
                keyboardType='email-address'
                autoCapitalize='none'
                value={email}
                onChangeText={setEmail}
            />
        </View>

        {/* Rol */}
        <View style={styles.field}>
            <Text style={styles.label}>ROL</Text>

            <TouchableOpacity
                style={styles.select}
                onPress={() => setShowRoles(!showRoles)}
                activeOpacity={0.8}
            >
                <Text style={styles.selectText}>{role}</Text>
                <ChevronDown size={20} color='#6B7280' />
            </TouchableOpacity>

            {showRoles && (
                <View style={styles.dropdown}>
                    {roles.map((item, index) => (
                        <View key={item}>
                            <TouchableOpacity
                                style={styles.dropdownOption}
                                onPress={() => {
                                    setRole(item);
                                    setShowRoles(false);
                                }}
                            >
                                <Text style={styles.dropdownText}>{item}</Text>
                            </TouchableOpacity>

                            {index < roles.length - 1 && (
                                <View style={styles.dropdownDivider} />
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>

        {/* Contraseña */}
        <View style={styles.field}>
            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput
                style={styles.input}
                placeholder='Ingresa una contraseña'
                placeholderTextColor='#A1A1AA'
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
        </View>

        {/* Botón */}
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={handleRegister}
        >
            <Check size={20} color='white' />
            <Text style={styles.buttonText}>Registrar Usuario</Text>
        </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F4F0',
    },

    content: {
        padding: 16,
        paddingBottom: 40,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
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

    field: {
        marginBottom: 22,
    },

    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4B5563',
        letterSpacing: 0.6,
        marginBottom: 8,
    },

    input: {
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1F2937',
    },

    select: {
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    selectText: {
        fontSize: 16,
        color: '#1F2937',
    },

    dropdown: {
        marginTop: 8,
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 16,
        overflow: 'hidden',
    },

    dropdownOption: {
        paddingHorizontal: 16,
        paddingVertical: 14,
    },

    dropdownDivider: {
        height: 1,
        backgroundColor: '#E5E3DE',
    },

    dropdownText: {
        fontSize: 16,
        color: '#1F2937',
    },

    button: {
        marginTop: 20,
        height: 58,
        borderRadius: 16,
        backgroundColor: '#7A1F1F',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#7A1F1F',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 5,

    },

    buttonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '700',
        marginLeft: 8,
    },
});
