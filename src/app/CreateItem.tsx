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

const materials = [
    'Madera',
    'Metal',
    'Bronce',
    'Plata',
    'Oro',
    'Vidrio',
    'Cerámica',
    'Tela',
];

const states = [
    'DISPONIBLE',
    'EN USO',
    'PRESTADO',
    'EN MANTENIMIENTO',
];

const locations = [
    'Altar Mayor',
    'Sacristía',
    'Capilla del Sagrario',
    'Nave Central',
];

export default function CreateItem() {
    const [areaCode, setAreaCode] = useState('');
    const [objectCode, setObjectCode] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [material, setMaterial] = useState('Seleccionar...');
    const [showMaterials, setShowMaterials] = useState(false);

    const [quantity, setQuantity] = useState('1');

    const [state, setState] = useState('Seleccionar...');
    const [showStates, setShowStates] = useState(false);

    const [location, setLocation] = useState('Seleccionar...');
    const [showLocations, setShowLocations] = useState(false);

    const [notes, setNotes] = useState('');

    const handleBack = () => {
        console.log('Regresar');
    };

    const handleRegister = () => {
        console.log({
            areaCode,
            objectCode,
            name,
            description,
            material,
            quantity,
            state,
            location,
            notes,
        });
    };

    const renderDropdown = (
        label: string,
        value: string,
        setValue: (v: string) => void,
        open: boolean,
        setOpen: (v: boolean) => void,
        options: string[]
    ) => (<View style={styles.field}> <Text style={styles.label}>{label}</Text>

        ```
        <TouchableOpacity
            style={styles.select}
            onPress={() => setOpen(!open)}
            activeOpacity={0.8}
        >
            <Text style={styles.selectText}>{value}</Text>
            <ChevronDown size={20} color='#6B7280' />
        </TouchableOpacity>

        {open && (
            <View style={styles.dropdown}>
                {options.map((item, index) => (
                    <View key={item}>
                        <TouchableOpacity
                            style={styles.dropdownOption}
                            onPress={() => {
                                setValue(item);
                                setOpen(false);
                            }}
                        >
                            <Text style={styles.dropdownText}>{item}</Text>
                        </TouchableOpacity>

                        {index < options.length - 1 && (
                            <View style={styles.dropdownDivider} />
                        )}
                    </View>
                ))}
            </View>
        )}
    </View>

    );

    return (<SafeAreaView style={styles.container}> <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
    >
        {/* Encabezado */} <View style={styles.header}> <TouchableOpacity
            onPress={handleBack}
            style={styles.headerButton}
        > <ArrowLeft size={22} color='#555' /> </TouchableOpacity>

            <Text style={styles.title}>Nuevo Artículo</Text>

            <View style={styles.headerButton} />
        </View>

        {/* Códigos */}
        <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>CÓD. ÁREA</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Ej: ALT'
                    placeholderTextColor='#A1A1AA'
                    autoCapitalize='characters'
                    value={areaCode}
                    onChangeText={setAreaCode}
                />
            </View>

            <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>CÓD. OBJETO</Text>
                <TextInput
                    style={styles.input}
                    placeholder='001'
                    placeholderTextColor='#A1A1AA'
                    keyboardType='numeric'
                    value={objectCode}
                    onChangeText={setObjectCode}
                />
            </View>
        </View>

        {/* Nombre */}
        <View style={styles.field}>
            <Text style={styles.label}>NOMBRE DEL OBJETO</Text>
            <TextInput
                style={styles.input}
                placeholder='Ej: Cáliz Principal'
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
                placeholder='Detalles específicos...'
                placeholderTextColor='#A1A1AA'
                multiline
                numberOfLines={5}
                textAlignVertical='top'
                value={description}
                onChangeText={setDescription}
            />
        </View>

        {/* Material */}
        {renderDropdown(
            'MATERIAL',
            material,
            setMaterial,
            showMaterials,
            setShowMaterials,
            materials
        )}

        {/* Cantidad y Estado */}
        <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>CANTIDAD</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='numeric'
                    value={quantity}
                    onChangeText={setQuantity}
                />
            </View>

            <View style={[styles.field, styles.halfField]}>
                {renderDropdown(
                    'ESTADO',
                    state,
                    setState,
                    showStates,
                    setShowStates,
                    states
                )}
            </View>
        </View>

        {/* Ubicación */}
        {renderDropdown(
            'LUGAR (UBICACIÓN)',
            location,
            setLocation,
            showLocations,
            setShowLocations,
            locations
        )}

        {/* Observaciones */}
        <View style={styles.field}>
            <Text style={styles.label}>OBSERVACIONES</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder='Notas adicionales...'
                placeholderTextColor='#A1A1AA'
                multiline
                numberOfLines={4}
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
            <Text style={styles.buttonText}>
                Registrar Artículo
            </Text>
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

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },

    halfField: {
        flex: 1,
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
