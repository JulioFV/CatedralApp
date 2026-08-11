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

const responsables = [
    'P. JUAN',
    'P. LUIS',
    'SACRISTÁN',
    'SECRETARIA',
    'VOLUNTARIO',
];

export default function CreateLocation() {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [reference, setReference] = useState('');
    const [responsable, setResponsable] = useState('Seleccionar...');
    const [showResponsables, setShowResponsables] = useState(false);
    const [notes, setNotes] = useState('');

    const handleBack = () => {
        console.log('Regresar');
        // navigation.goBack();
    };

    const handleRegister = () => {
        console.log({
            code,
            name,
            reference,
            responsable,
            notes,
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

            <Text style={styles.title}>Nueva Ubicación</Text>

            <View style={styles.headerButton} />
        </View>

        {/* Código de área */}
        <View style={styles.field}>
            <Text style={styles.label}>CÓDIGO DE ÁREA</Text>
            <TextInput
                style={styles.input}
                placeholder='Ej: SAC'
                placeholderTextColor='#A1A1AA'
                autoCapitalize='characters'
                value={code}
                onChangeText={setCode}
            />
        </View>

        {/* Nombre general */}
        <View style={styles.field}>
            <Text style={styles.label}>NOMBRE GENERAL</Text>
            <TextInput
                style={styles.input}
                placeholder='Ej: Sacristía'
                placeholderTextColor='#A1A1AA'
                value={name}
                onChangeText={setName}
            />
        </View>

        {/* Ubicación de referencia */}
        <View style={styles.field}>
            <Text style={styles.label}>UBICACIÓN DE REFERENCIA</Text>
            <TextInput
                style={styles.input}
                placeholder='Ej: Planta baja, junto al presbiterio'
                placeholderTextColor='#A1A1AA'
                value={reference}
                onChangeText={setReference}
            />
        </View>

        {/* Responsable */}
        <View style={styles.field}>
            <Text style={styles.label}>RESPONSABLE</Text>

            <TouchableOpacity
                style={styles.select}
                onPress={() => setShowResponsables(!showResponsables)}
                activeOpacity={0.8}
            >
                <Text style={styles.selectText}>{responsable}</Text>
                <ChevronDown size={20} color='#6B7280' />
            </TouchableOpacity>

            {showResponsables && (
                <View style={styles.dropdown}>
                    {responsables.map((item, index) => (
                        <View key={item}>
                            <TouchableOpacity
                                style={styles.dropdownOption}
                                onPress={() => {
                                    setResponsable(item);
                                    setShowResponsables(false);
                                }}
                            >
                                <Text style={styles.dropdownText}>{item}</Text>
                            </TouchableOpacity>

                            {index < responsables.length - 1 && (
                                <View style={styles.dropdownDivider} />
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>

        {/* Observaciones */}
        <View style={styles.field}>
            <Text style={styles.label}>OBSERVACIONES</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder='Notas...'
                placeholderTextColor='#A1A1AA'
                multiline
                numberOfLines={5}
                textAlignVertical='top'
                value={notes}
                onChangeText={setNotes}
            />
        </View>

        {/* Botón */}
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={handleRegister}
        >
            <Check size={20} color='white' />
            <Text style={styles.buttonText}>Registrar Ubicación</Text>
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
