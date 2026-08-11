import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Calendar,
    Check,
    ChevronDown,
} from 'lucide-react-native';
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

const articles = [
    'Cáliz de Plata',
    'Custodia Dorada',
    'Candelabro Bronce',
];

const users = [
    'Juan Pérez',
    'María López',
    'P. Juan',
    'P. Luis',
];

const guaranteeTypes = [
    'INE',
    'Pasaporte',
    'Licencia de conducir',
    'Credencial institucional',
];

export default function CreateLoan() {
    const [article, setArticle] = useState('Seleccionar...');
    const [showArticles, setShowArticles] = useState(false);
    const router = useRouter();

    const [registeredUser, setRegisteredUser] = useState(false);

    const [user, setUser] = useState('Seleccionar...');
    const [showUsers, setShowUsers] = useState(false);

    const [borrowerName, setBorrowerName] = useState('');
    const [phone, setPhone] = useState('');

    const [guaranteeType, setGuaranteeType] = useState('Seleccionar...');
    const [showGuarantees, setShowGuarantees] = useState(false);

    const [guaranteeDescription, setGuaranteeDescription] = useState('');
    const [notes, setNotes] = useState('');

    const [expectedDate, setExpectedDate] = useState<Date | null>(null);
    const [realDate, setRealDate] = useState<Date | null>(null);

    const [showExpectedPicker, setShowExpectedPicker] = useState(false);
    const [showRealPicker, setShowRealPicker] = useState(false);

    const handleBack = () => {
        router.back();
    };
    const formatDate = (date: Date | null) => {
        if (!date) return 'dd/mm/aaaa';

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const handleRegister = () => {
        console.log({
            article,
            registeredUser,
            user,
            borrowerName,
            phone,
            guaranteeType,
            guaranteeDescription,
            expectedDate: expectedDate?.toISOString(),
            realDate: realDate?.toISOString(),
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

            <Text style={styles.title}>Nuevo Préstamo</Text>

            <View style={styles.headerButton} />
        </View>

        {/* Artículo */}
        {renderDropdown(
            'SELECCIONAR ARTÍCULO',
            article,
            setArticle,
            showArticles,
            setShowArticles,
            articles
        )}

        {/* Checkbox */}
        <TouchableOpacity
            style={styles.checkboxCard}
            activeOpacity={0.8}
            onPress={() => setRegisteredUser(!registeredUser)}
        >
            <View
                style={[
                    styles.checkbox,
                    registeredUser && styles.checkboxChecked,
                ]}
            >
                {registeredUser && (
                    <Check size={16} color='white' />
                )}
            </View>

            <Text style={styles.checkboxText}>
                ¿El solicitante es un usuario registrado?
            </Text>
        </TouchableOpacity>

        {/* Cambio dinámico */}
        {registeredUser ? (
            renderDropdown(
                'USUARIO SOLICITANTE',
                user,
                setUser,
                showUsers,
                setShowUsers,
                users
            )
        ) : (
            <View style={styles.groupCard}>
                <View style={styles.field}>
                    <Text style={styles.label}>
                        NOMBRE DEL SOLICITANTE
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Ej: María López'
                        placeholderTextColor='#A1A1AA'
                        value={borrowerName}
                        onChangeText={setBorrowerName}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>TELÉFONO</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='123-456-7890'
                        placeholderTextColor='#A1A1AA'
                        keyboardType='phone-pad'
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>
            </View>
        )}

        {/* Garantía */}
        {renderDropdown(
            'TIPO DE GARANTÍA',
            guaranteeType,
            setGuaranteeType,
            showGuarantees,
            setShowGuarantees,
            guaranteeTypes
        )}

        {/* Descripción garantía */}
        <View style={styles.field}>
            <Text style={styles.label}>
                DESCRIPCIÓN DE GARANTÍA
            </Text>
            <TextInput
                style={styles.input}
                placeholder='Ej: INE Original'
                placeholderTextColor='#A1A1AA'
                value={guaranteeDescription}
                onChangeText={setGuaranteeDescription}
            />
        </View>

        {/* Fechas */}
        {/* Fechas */}
        <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>FECHA PREVISTA</Text>

                <TouchableOpacity
                    style={styles.dateInput}
                    activeOpacity={0.8}
                    onPress={() => setShowExpectedPicker(true)}
                >
                    <Text style={styles.dateText}>
                        {formatDate(expectedDate)}
                    </Text>
                    <Calendar size={18} color="#6B7280" />
                </TouchableOpacity>

                {showExpectedPicker && (
                    <DateTimePicker
                        value={expectedDate ?? new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowExpectedPicker(false);

                            if (selectedDate) {
                                setExpectedDate(selectedDate);
                            }
                        }}
                    />
                )}
            </View>

            <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>FECHA REAL</Text>

                <TouchableOpacity
                    style={styles.dateInput}
                    activeOpacity={0.8}
                    onPress={() => setShowRealPicker(true)}
                >
                    <Text style={styles.dateText}>
                        {formatDate(realDate)}
                    </Text>
                    <Calendar size={18} color="#6B7280" />
                </TouchableOpacity>

                {showRealPicker && (
                    <DateTimePicker
                        value={realDate ?? new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowRealPicker(false);

                            if (selectedDate) {
                                setRealDate(selectedDate);
                            }
                        }}
                    />
                )}
            </View>
        </View>

        {/* Observaciones */}
        <View style={styles.field}>
            <Text style={styles.label}>OBSERVACIONES</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder='Condiciones del préstamo...'
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
            <Text style={styles.buttonText}>
                Registrar Préstamo
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

    checkboxCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 18,
        padding: 16,
        marginBottom: 22,
    },

    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#8B8B8B',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: '#F8F7F4',
    },

    checkboxChecked: {
        backgroundColor: '#7A1F1F',
        borderColor: '#7A1F1F',
    },

    checkboxText: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },

    groupCard: {
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 18,
        padding: 16,
        marginBottom: 22,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },

    halfField: {
        flex: 1,
    },

    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 16,
        paddingHorizontal: 14,
        height: 56,
    },

    dateText: {
        flex: 1,
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
