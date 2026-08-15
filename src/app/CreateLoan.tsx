import { ApiError } from '@/api/axiosClient';
import { getGarantias } from '@/api/services/garantiaService';
import { getItems } from '@/api/services/itemService';
import {
    createLoan,
    CreateLoanPayload,
    isCreateSuccess,
    updateLoan,
    UpdateLoanPayload,
} from '@/api/services/loanService';
import { getUsers } from '@/api/services/userService';
import ItemSelectModal from '@/components/ItemSelectModal';
import LocationFilterBar, { LocationOption } from '@/components/LocationFilterBar';
import SelectField from '@/components/SelectField';
import SelectModal, { SelectOption } from '@/components/SelectModal';
import { Garantia } from '@/models/Garantia';
import { Item } from '@/models/Item';
import { Prestamo } from '@/models/Prestamo';
import { Usuario } from '@/models/Usuario';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const ESTATUS_ACTIVO = 1;

// Código corto SOLO visual para los chips de garantía — no se envía al servidor
const codeFromNombre = (nombre: string): string =>
    nombre.length <= 4 ? nombre.toUpperCase() : nombre.substring(0, 3).toUpperCase();

export default function CreateLoan() {
    const router = useRouter();
    const { id_prestamo, loanData } = useLocalSearchParams<{
        id_prestamo?: string;
        loanData?: string;
    }>();

    const isEditMode = !!id_prestamo;

    const parsedLoan: Prestamo | null = useMemo(
        () => (loanData ? JSON.parse(loanData) : null),
        [loanData]
    );

    // Catálogos
    const [items, setItems] = useState<Item[]>([]);
    const [garantias, setGarantias] = useState<Garantia[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loadingCatalogos, setLoadingCatalogos] = useState<boolean>(true);
    const [catalogError, setCatalogError] = useState<string | null>(null);

    // Selecciones
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [itemModalVisible, setItemModalVisible] = useState<boolean>(false);

    const [registeredUser, setRegisteredUser] = useState<boolean>(false);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
    const [userModalVisible, setUserModalVisible] = useState<boolean>(false);

    const [borrowerName, setBorrowerName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');

    const [selectedGarantiaId, setSelectedGarantiaId] = useState<number | null>(null);

    const [cantidad, setCantidad] = useState<string>('1');
    const [notes, setNotes] = useState<string>('');

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState<boolean>(false);

    // 1) Cargar los 3 catálogos en paralelo
    useEffect(() => {
        const loadCatalogos = async (): Promise<void> => {
            try {
                setLoadingCatalogos(true);
                setCatalogError(null);

                const [itemsRes, garantiasRes, usersRes] = await Promise.all([
                    getItems(),
                    getGarantias(),
                    getUsers(),
                ]);

                if (itemsRes.status === 'success') setItems(itemsRes.data);
                if (garantiasRes.success) setGarantias(garantiasRes.data);
                if (usersRes.status === 'success') setUsuarios(usersRes.data);
            } catch (error) {
                const apiError = error as ApiError;
                setCatalogError(apiError.mensaje ?? 'No se pudieron cargar los catálogos');
            } finally {
                setLoadingCatalogos(false);
            }
        };

        loadCatalogos();
    }, []);

    // 2) Modo edición: prellenar una vez que los catálogos ya cargaron
    useEffect(() => {
        if (!parsedLoan || loadingCatalogos) return;

        const foundItem = items.find((i) => i.id_item === parsedLoan.id_item) ?? null;
        setSelectedItem(foundItem);

        setSelectedGarantiaId(parsedLoan.id_garantia);
        setCantidad(parsedLoan.cantidad.toString());
        setNotes(parsedLoan.observaciones ?? '');

        if (parsedLoan.id_usuario) {
            setRegisteredUser(true);
            const foundUser = usuarios.find((u) => u.id_usuario === parsedLoan.id_usuario) ?? null;
            setSelectedUsuario(foundUser);
        } else {
            setRegisteredUser(false);
            setBorrowerName(parsedLoan.nombre_solicitante);
            setPhone(parsedLoan.telefono_solicitante);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingCatalogos]);

    const handleBack = (): void => router.back();

    // Cuánto se puede prestar del artículo seleccionado.
    // En edición, si el préstamo es del mismo artículo, se suma de vuelta
    // la cantidad que ya tenía este préstamo (porque ya está descontada del stock).
    const maxDisponible = useMemo(() => {
        if (!selectedItem) return 0;
        const yaDescontado =
            isEditMode && parsedLoan?.id_item === selectedItem.id_item ? parsedLoan.cantidad : 0;
        return selectedItem.cantidad - selectedItem.cantidad_prestada + yaDescontado;
    }, [selectedItem, isEditMode, parsedLoan]);

    const handleSelectItem = (item: Item): void => {
        setSelectedItem(item);
        setItemModalVisible(false);
        setErrors((prev) => ({ ...prev, item: '' }));
    };

    const handleSelectUsuario = (option: SelectOption): void => {
        const usuario = usuarios.find((u) => u.id_usuario === option.id) ?? null;
        setSelectedUsuario(usuario);
        setUserModalVisible(false);
        setErrors((prev) => ({ ...prev, usuario: '' }));
    };

    const handleToggleRegisteredUser = (): void => {
        setRegisteredUser((prev) => !prev);
        setErrors((prev) => ({ ...prev, usuario: '', borrowerName: '', phone: '' }));
    };
    const handleRegister = async (): Promise<void> => {
    if (!validate()) return;
    if (!selectedItem || !selectedGarantiaId) return; // ya validado arriba

    const camposComunes = {
        id_item: selectedItem.id_item,
        id_usuario: registeredUser && selectedUsuario ? selectedUsuario.id_usuario : null,
        nombre_solicitante: registeredUser && selectedUsuario ? selectedUsuario.nombre : borrowerName.trim(),
        telefono_solicitante: registeredUser ? '' : phone.trim(),
        cantidad: Number(cantidad),
        id_garantia: selectedGarantiaId,
        observaciones: notes.trim(),
    };

    try {
        setSubmitting(true);

        if (isEditMode && parsedLoan) {
            // En edición se preservan estatus, fecha_prestamo y fecha_devolucion
            // originales; este formulario no los modifica.
            const updatePayload: UpdateLoanPayload = {
                ...camposComunes,
                estatus: parsedLoan.estatus,
                fecha_prestamo: parsedLoan.fecha_prestamo,
                fecha_devolucion: parsedLoan.fecha_devolucion,
            };

            const result = await updateLoan(parsedLoan.id_prestamo, updatePayload);

            if (!result.error) {
                Alert.alert('Éxito', result.mensaje, [
                    { text: 'Aceptar', onPress: () => router.back() },
                ]);
            } else {
                Alert.alert('No se pudo actualizar el préstamo', result.mensaje);
            }
        } else {
            const createPayload: CreateLoanPayload = {
                ...camposComunes,
                estatus: ESTATUS_ACTIVO,
            };

            const result = await createLoan(createPayload);

            if (isCreateSuccess(result)) {
                Alert.alert('Éxito', result.message, [
                    { text: 'Aceptar', onPress: () => router.back() },
                ]);
            } else {
                Alert.alert('No se pudo registrar el préstamo', result.mensaje);
            }
        }
    } catch (error) {
        const apiError = error as ApiError;
        Alert.alert('Error', apiError.mensaje || 'Ocurrió un error al guardar el préstamo');
    } finally {
        setSubmitting(false);
    }
};

    const garantiaOptions: LocationOption[] = garantias.map((g) => ({
        id: g.id_garantia,
        code: codeFromNombre(g.nombre),
        name: g.nombre,
    }));

    const usuarioOptions: SelectOption[] = usuarios.map((u) => ({
        id: u.id_usuario,
        label: u.nombre,
        sublabel: u.email,
    }));

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!selectedItem) newErrors.item = 'Selecciona un artículo';
        if (!selectedGarantiaId) newErrors.garantia = 'Selecciona un tipo de garantía';

        if (registeredUser) {
            if (!selectedUsuario) newErrors.usuario = 'Selecciona un usuario';
        } else {
            if (!borrowerName.trim()) newErrors.borrowerName = 'El nombre del solicitante es obligatorio';
            if (!phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
        }

        const cantidadNum = Number(cantidad);
        if (!cantidad.trim() || isNaN(cantidadNum) || cantidadNum <= 0) {
            newErrors.cantidad = 'Ingresa una cantidad válida';
        } else if (selectedItem && cantidadNum > maxDisponible) {
            newErrors.cantidad = `Solo hay ${maxDisponible} unidad(es) disponible(s)`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    if (loadingCatalogos) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerMessage}>
                    <ActivityIndicator size="large" color="#7A1F1F" />
                </View>
            </SafeAreaView>
        );
    }

    if (catalogError) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                        <ArrowLeft size={22} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{isEditMode ? 'Editar Préstamo' : 'Nuevo Préstamo'}</Text>
                    <View style={styles.headerButton} />
                </View>
                <View style={styles.centerMessage}>
                    <Text style={styles.errorText}>{catalogError}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                            <ArrowLeft size={22} color="#555" />
                        </TouchableOpacity>
                        <Text style={styles.title}>{isEditMode ? 'Editar Préstamo' : 'Nuevo Préstamo'}</Text>
                        <View style={styles.headerButton} />
                    </View>

                    {/* Artículo */}
                    <SelectField
                        label="ARTÍCULO"
                        value={selectedItem ? `${selectedItem.nombre} (${selectedItem.codigo})` : ''}
                        placeholder="Buscar y seleccionar artículo..."
                        onPress={() => setItemModalVisible(true)}
                        error={errors.item}
                    />
                    {selectedItem && (
                        <Text style={styles.stockHint}>
                            Disponibles: {maxDisponible} de {selectedItem.cantidad}
                        </Text>
                    )}

                    {/* Checkbox usuario registrado */}
                    <TouchableOpacity
                        style={styles.checkboxCard}
                        activeOpacity={0.8}
                        onPress={handleToggleRegisteredUser}
                    >
                        <View style={[styles.checkbox, registeredUser && styles.checkboxChecked]}>
                            {registeredUser && <Check size={16} color="white" />}
                        </View>
                        <Text style={styles.checkboxText}>¿El solicitante es un usuario registrado?</Text>
                    </TouchableOpacity>

                    {/* Cambio dinámico: usuario registrado vs. datos manuales */}
                    {registeredUser ? (
                        <SelectField
                            label="USUARIO SOLICITANTE"
                            value={selectedUsuario?.nombre ?? ''}
                            placeholder="Selecciona un usuario"
                            onPress={() => setUserModalVisible(true)}
                            error={errors.usuario}
                        />
                    ) : (
                        <View style={styles.groupCard}>
                            <View style={styles.field}>
                                <Text style={styles.label}>NOMBRE DEL SOLICITANTE</Text>
                                <TextInput
                                    style={[styles.input, errors.borrowerName && styles.inputError]}
                                    placeholder="Ej: María López"
                                    placeholderTextColor="#A1A1AA"
                                    value={borrowerName}
                                    onChangeText={setBorrowerName}
                                />
                                {errors.borrowerName ? (
                                    <Text style={styles.errorHint}>{errors.borrowerName}</Text>
                                ) : null}
                            </View>

                            <View style={[styles.field, { marginBottom: 0 }]}>
                                <Text style={styles.label}>TELÉFONO</Text>
                                <TextInput
                                    style={[styles.input, errors.phone && styles.inputError]}
                                    placeholder="123-456-7890"
                                    placeholderTextColor="#A1A1AA"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                                {errors.phone ? <Text style={styles.errorHint}>{errors.phone}</Text> : null}
                            </View>
                        </View>
                    )}

                    {/* Garantía */}
                    <Text style={styles.label}>TIPO DE GARANTÍA</Text>
                    <LocationFilterBar
                        locations={garantiaOptions}
                        selectedId={selectedGarantiaId ?? -1}
                        onSelect={(id) => {
                            setSelectedGarantiaId(id);
                            setErrors((prev) => ({ ...prev, garantia: '' }));
                        }}
                    />
                    {errors.garantia ? <Text style={styles.errorHint}>{errors.garantia}</Text> : null}

                    {/* Cantidad */}
                    <View style={styles.field}>
                        <Text style={styles.label}>CANTIDAD</Text>
                        <TextInput
                            style={[styles.input, errors.cantidad && styles.inputError]}
                            keyboardType="numeric"
                            value={cantidad}
                            onChangeText={setCantidad}
                        />
                        {errors.cantidad ? <Text style={styles.errorHint}>{errors.cantidad}</Text> : null}
                    </View>

                    {/* Observaciones */}
                    <View style={styles.field}>
                        <Text style={styles.label}>OBSERVACIONES</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Condiciones del préstamo..."
                            placeholderTextColor="#A1A1AA"
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>

                    {/* Botón */}
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.85}
                        onPress={handleRegister}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <Check size={20} color="white" />
                                <Text style={styles.buttonText}>
                                    {isEditMode ? 'Guardar Cambios' : 'Registrar Préstamo'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            <ItemSelectModal
                visible={itemModalVisible}
                items={items}
                selectedId={selectedItem?.id_item ?? null}
                onSelect={handleSelectItem}
                onClose={() => setItemModalVisible(false)}
            />

            <SelectModal
                visible={userModalVisible}
                title="Selecciona un usuario"
                options={usuarioOptions}
                selectedId={selectedUsuario?.id_usuario ?? null}
                onSelect={handleSelectUsuario}
                onClose={() => setUserModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F4F0' },
    content: { padding: 16, paddingBottom: 40 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
        marginTop: 30,
    },
    headerButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: '700', color: '#7A1F1F' },
    field: { marginBottom: 22 },
    label: { fontSize: 12, fontWeight: '700', color: '#4B5563', letterSpacing: 0.6, marginBottom: 8 },
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
    inputError: { borderColor: '#B91C1C' },
    errorHint: { fontSize: 12, color: '#B91C1C', marginTop: -14, marginBottom: 16 },
    stockHint: { fontSize: 12, color: '#6B7280', marginTop: -14, marginBottom: 16 },
    textArea: { minHeight: 120 },
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
    checkboxChecked: { backgroundColor: '#7A1F1F', borderColor: '#7A1F1F' },
    checkboxText: { flex: 1, fontSize: 16, color: '#1F2937' },
    groupCard: {
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 18,
        padding: 16,
        marginBottom: 22,
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
    buttonText: { color: 'white', fontSize: 17, fontWeight: '700', marginLeft: 8 },
    centerMessage: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    errorText: { color: '#B91C1C', fontSize: 15, textAlign: 'center' },
});