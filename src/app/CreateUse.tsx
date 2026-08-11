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

export default function CreateUse() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('ACTIVO');
    const [showStatusOptions, setShowStatusOptions] = useState(false);
    const handleBack = () => {
        console.log('Regresar');
        // navigation.goBack();
    };

    const handleRegister = () => {
        console.log({
            name,
            description,
            status,
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

            <Text style={styles.title}>Nuevo Uso</Text>

            {/* Espacio para centrar el título */}
            <View style={styles.headerButton} />
        </View>

        {/* Nombre del uso */}
        <View style={styles.field}>
            <Text style={styles.label}>NOMBRE DEL USO</Text>

            <TextInput
                style={styles.input}
                placeholder='Ej: Liturgia Dominical'
                placeholderTextColor='#A1A1AA'
                value={name}
                onChangeText={setName}
            />
        </View>

        {/* Descripción */}
        <View style={styles.field}>
            <Text style={styles.label}>DESCRIPCIÓN</Text>

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder='Describe brevemente en qué consiste este uso...'
                placeholderTextColor='#A1A1AA'
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                textAlignVertical='top'
            />
        </View>

        {/* Estado */}
        {/* Estado */}
        <View style={styles.field}>
            <Text style={styles.label}>ESTADO</Text>

            <TouchableOpacity
                style={styles.select}
                onPress={() => setShowStatusOptions(!showStatusOptions)}
                activeOpacity={0.8}
            >
                <Text style={styles.selectText}>{status}</Text>
                <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>

            {showStatusOptions && (
                <View style={styles.dropdown}>
                    <TouchableOpacity
                        style={styles.dropdownOption}
                        onPress={() => {
                            setStatus('ACTIVO');
                            setShowStatusOptions(false);
                        }}
                    >
                        <Text style={styles.dropdownText}>ACTIVO</Text>
                    </TouchableOpacity>

                    <View style={styles.dropdownDivider} />

                    <TouchableOpacity
                        style={styles.dropdownOption}
                        onPress={() => {
                            setStatus('INACTIVO');
                            setShowStatusOptions(false);
                        }}
                    >
                        <Text style={styles.dropdownText}>INACTIVO</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>

        {/* Botón */}
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={handleRegister}
        >
            <Check size={20} color='white' />
            <Text style={styles.buttonText}>Registrar Uso</Text>
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

    textArea: {
        minHeight: 120,
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
});
