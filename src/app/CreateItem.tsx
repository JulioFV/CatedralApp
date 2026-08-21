import { ApiError } from '@/api/axiosClient';
import { getAreas } from '@/api/services/areaService';
import { getEstados } from '@/api/services/estadoService';
import { createItem, CreateItemPayload, updateItem } from '@/api/services/itemService';
import { getMateriales } from '@/api/services/materialService';
import { getUsos } from '@/api/services/usoService';
import CsvImportModal from '@/components/CsvImportModal';
import { CustomAlert as Alert } from '@/components/CustomAlert';
import { Estado } from '@/models/Estado';
import { Item } from '@/models/Item';
import { Lugar } from '@/models/Lugar';
import { Material } from '@/models/Material';
import { Uso } from '@/models/Uso';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check, FileUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
import OptionGridSelector, { OptionItem } from '../components/OptionGridSelector';

export default function CreateItem() {
    const router = useRouter();
    const { id_item, itemData } = useLocalSearchParams<{ id_item?: string; itemData?: string }>();

    const isEditMode = !!id_item;
    const parsedItem: Item | null = itemData ? JSON.parse(itemData) : null;

    // Catálogos
    const [materiales, setMateriales] = useState<Material[]>([]);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [lugares, setLugares] = useState<Lugar[]>([]);
    const [usos, setUsos] = useState<Uso[]>([]);
    const [loadingCatalogos, setLoadingCatalogos] = useState<boolean>(true);
    const [catalogError, setCatalogError] = useState<string | null>(null);

    // Campos del formulario
    const [areaCode, setAreaCode] = useState<string>('');
    const [objectCode, setObjectCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('1');
    const [notes, setNotes] = useState<string>('');

    // Selecciones (ids como string para calzar con OptionGridSelector)
    const [material, setMaterial] = useState<string | null>(null);
    const [estado, setEstado] = useState<string | null>(null);
    const [lugar, setLugar] = useState<string | null>(null);
    const [uso, setUso] = useState<string | null>(null);

    // Valores que solo se fuerzan en creación; en edición se conservan los originales
    const [cantidadPrestada, setCantidadPrestada] = useState<number>(0);
    const [activo, setActivo] = useState<number>(1);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [csvModalVisible, setCsvModalVisible] = useState<boolean>(false);

    // 1) Cargar los 4 catálogos en paralelo
    useEffect(() => {
        const loadCatalogos = async (): Promise<void> => {
            try {
                setLoadingCatalogos(true);
                setCatalogError(null);

                const [materialesRes, estadosRes, areasRes, usosRes] = await Promise.all([
                    getMateriales(),
                    getEstados(),
                    getAreas(),
                    getUsos(),
                ]);

                if (materialesRes.success) setMateriales(materialesRes.data);
                if (estadosRes.success) setEstados(estadosRes.data);
                if (areasRes.success) setLugares(areasRes.data);
                if (!usosRes.error) setUsos(usosRes.contenido);
            } catch (error) {
                const apiError = error as ApiError;
                setCatalogError(apiError.mensaje ?? 'No se pudieron cargar los catálogos');
            } finally {
                setLoadingCatalogos(false);
            }
        };

        loadCatalogos();
    }, []);

    // 2) En modo edición: prellenar el formulario una vez que los catálogos ya cargaron
    useEffect(() => {
        if (!parsedItem || loadingCatalogos) return;

        const [areaPart, ...objectParts] = parsedItem.codigo.split('-');
        setAreaCode(areaPart ?? '');
        setObjectCode(objectParts.join('-') ?? '');

        setName(parsedItem.nombre);
        setDescription(parsedItem.descripcion ?? '');
        setQuantity(parsedItem.cantidad.toString());
        setNotes(parsedItem.observaciones ?? '');

        setCantidadPrestada(parsedItem.cantidad_prestada);
        setActivo(parsedItem.activo);

        const foundMaterial = materiales.find((m) => m.nombre === parsedItem.material);
        const foundEstado = estados.find((e) => e.nombre === parsedItem.estado);
        const foundLugar = lugares.find((l) => l.codigo === parsedItem.codigo_lugar);
        const foundUso = usos.find((u) => u.nombre === parsedItem.uso);

        setMaterial(foundMaterial ? foundMaterial.id_material.toString() : null);
        setEstado(foundEstado ? foundEstado.id_estado.toString() : null);
        setLugar(foundLugar ? foundLugar.id_lugar.toString() : null);
        setUso(foundUso ? foundUso.id_uso.toString() : null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingCatalogos]);

    const handleBack = (): void => router.back();

    // Al elegir una ubicación, el código de área se autocompleta y queda bloqueado
    const handleSelectLugar = (id: string): void => {
        setLugar(id);
        const selectedLugar = lugares.find((l) => l.id_lugar.toString() === id);
        setAreaCode(selectedLugar?.codigo ?? '');
        setErrors((prev) => ({ ...prev, lugar: '', areaCode: '' }));
    };

    const materialOptions: OptionItem[] = materiales.map((m) => ({
        id: m.id_material.toString(),
        label: m.nombre,
    }));

    const estadoOptions: OptionItem[] = estados.map((e) => ({
        id: e.id_estado.toString(),
        label: e.nombre,
    }));

    const lugarOptions: OptionItem[] = lugares.map((l) => ({
        id: l.id_lugar.toString(),
        label: l.nombre,
    }));

    const usoOptions: OptionItem[] = usos.map((u) => ({
        id: u.id_uso.toString(),
        label: u.nombre,
    }));

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!lugar) newErrors.lugar = 'Selecciona una ubicación';
        if (!objectCode.trim()) newErrors.objectCode = 'El código de objeto es obligatorio';
        if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (!material) newErrors.material = 'Selecciona un material';
        if (!estado) newErrors.estado = 'Selecciona un estado';
        if (!uso) newErrors.uso = 'Selecciona un uso';

        const quantityNum = Number(quantity);
        if (!quantity.trim() || isNaN(quantityNum) || quantityNum <= 0) {
            newErrors.quantity = 'Ingresa una cantidad válida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (): Promise<void> => {
        if (!validate()) return;

        const payload: CreateItemPayload = {
            codigo: `${areaCode}-${objectCode.trim().toUpperCase()}`,
            nombre: name.trim(),
            descripcion: description.trim(),
            cantidad: Number(quantity),
            id_material: Number(material),
            id_estado: Number(estado),
            id_lugar: Number(lugar),
            id_uso: Number(uso),
            cantidad_prestada: cantidadPrestada,
            activo: activo,
            observaciones: notes.trim(),
        };

        try {
            setSubmitting(true);

            const result =
                isEditMode && parsedItem
                    ? await updateItem(parsedItem.id_item, payload)
                    : await createItem(payload);

            if (result.status === 'success') {
                Alert.alert('Éxito', result.message, [
                    { text: 'Aceptar', onPress: () => router.back() },
                ]);
            } else {
                const esCodigoDuplicado = result.message?.toLowerCase().includes('duplicate entry');
                Alert.alert(
                    'No se pudo guardar',
                    esCodigoDuplicado
                        ? `Ya existe un artículo con el código "${payload.codigo}". Cambia el código de objeto e intenta de nuevo.`
                        : result.message
                );
            }
        } catch (error) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.mensaje || 'Ocurrió un error al guardar el artículo');
        } finally {
            setSubmitting(false);
        }
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
                    <Text style={styles.title}>{isEditMode ? 'Editar Artículo' : 'Nuevo Artículo'}</Text>
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
                        <Text style={styles.title}>{isEditMode ? 'Editar Artículo' : 'Nuevo Artículo'}</Text>
                        <View style={styles.headerButton} />
                    </View>
                    {Platform.OS === 'web' && !isEditMode && (
                        <TouchableOpacity
                            style={styles.csvBanner}
                            activeOpacity={0.85}
                            onPress={() => setCsvModalVisible(true)}
                        >
                            <FileUp size={20} color="#7A1F1F" />
                            <View style={styles.csvBannerTextContainer}>
                                <Text style={styles.csvBannerTitle}>¿Vas a registrar varios artículos?</Text>
                                <Text style={styles.csvBannerSubtitle}>Impórtalos de una vez desde un archivo CSV</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    {/* Ubicación primero: de aquí se deriva el código de área */}
                    <OptionGridSelector
                        label="LUGAR (UBICACIÓN)"
                        options={lugarOptions}
                        selectedId={lugar}
                        onSelect={(id) => handleSelectLugar(id as string)}
                    />
                    {errors.lugar ? <Text style={styles.errorHint}>{errors.lugar}</Text> : null}

                    {/* Códigos */}
                    <View style={styles.row}>
                        <View style={[styles.field, styles.halfField]}>
                            <Text style={styles.label}>CÓD. ÁREA</Text>
                            <TextInput
                                style={[styles.input, styles.inputDisabled]}
                                placeholder="Se completa al elegir lugar"
                                placeholderTextColor="#A1A1AA"
                                value={areaCode}
                                editable={false}
                            />
                        </View>

                        <View style={[styles.field, styles.halfField]}>
                            <Text style={styles.label}>CÓD. OBJETO</Text>
                            <TextInput
                                style={[styles.input, errors.objectCode && styles.inputError]}
                                placeholder="Ej: CM5"
                                placeholderTextColor="#A1A1AA"
                                autoCapitalize="characters"
                                value={objectCode}
                                onChangeText={setObjectCode}
                            />
                        </View>
                    </View>
                    {errors.objectCode ? <Text style={styles.errorHint}>{errors.objectCode}</Text> : null}

                    {/* Nombre */}
                    <View style={styles.field}>
                        <Text style={styles.label}>NOMBRE DEL OBJETO</Text>
                        <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            placeholder="Ej: Cáliz Principal"
                            placeholderTextColor="#A1A1AA"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    {errors.name ? <Text style={styles.errorHint}>{errors.name}</Text> : null}

                    {/* Descripción */}
                    <View style={styles.field}>
                        <Text style={styles.label}>DESCRIPCIÓN</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Detalles específicos..."
                            placeholderTextColor="#A1A1AA"
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    {/* Material */}
                    <OptionGridSelector
                        label="MATERIAL"
                        options={materialOptions}
                        selectedId={material}
                        onSelect={(id) => setMaterial(id as string)}
                    />
                    {errors.material ? <Text style={styles.errorHint}>{errors.material}</Text> : null}

                    {/* Cantidad */}
                    <View style={styles.field}>
                        <Text style={styles.label}>CANTIDAD</Text>
                        <TextInput
                            style={[styles.input, errors.quantity && styles.inputError]}
                            keyboardType="numeric"
                            value={quantity}
                            onChangeText={setQuantity}
                        />
                    </View>
                    {errors.quantity ? <Text style={styles.errorHint}>{errors.quantity}</Text> : null}

                    {/* Estado */}
                    <OptionGridSelector
                        label="ESTADO"
                        options={estadoOptions}
                        selectedId={estado}
                        onSelect={(id) => setEstado(id as string)}
                    />
                    {errors.estado ? <Text style={styles.errorHint}>{errors.estado}</Text> : null}

                    {/* Uso */}
                    <OptionGridSelector
                        label="USO"
                        options={usoOptions}
                        selectedId={uso}
                        onSelect={(id) => setUso(id as string)}
                    />
                    {errors.uso ? <Text style={styles.errorHint}>{errors.uso}</Text> : null}

                    {/* Observaciones */}
                    <View style={styles.field}>
                        <Text style={styles.label}>OBSERVACIONES</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Notas adicionales..."
                            placeholderTextColor="#A1A1AA"
                            multiline
                            numberOfLines={4}
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
                                    {isEditMode ? 'Guardar Cambios' : 'Registrar Artículo'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
            <CsvImportModal
                visible={csvModalVisible}
                onClose={() => setCsvModalVisible(false)}
                onImported={() => {
                    // El usuario cierra el modal cuando esté listo (ya vio el resumen);
                    // aquí solo reaccionamos si hubo inserciones exitosas.
                    router.back();
                }}
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
    title: { fontSize: 28, fontWeight: '700', color: '#7A1F1F' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
    halfField: { flex: 1 },
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
    inputDisabled: { backgroundColor: '#EFEEE9', color: '#6B7280' },
    inputError: { borderColor: '#B91C1C' },
    textArea: { minHeight: 120 },
    errorHint: { fontSize: 12, color: '#B91C1C', marginTop: -14, marginBottom: 16 },
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
    csvBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1E9D2',
        borderWidth: 1,
        borderColor: '#C9A44C',
        borderRadius: 16,
        padding: 14,
        marginBottom: 22,
    },
    csvBannerTextContainer: { marginLeft: 12, flex: 1 },
    csvBannerTitle: { fontSize: 14, fontWeight: '700', color: '#7A1F1F' },
    csvBannerSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
});