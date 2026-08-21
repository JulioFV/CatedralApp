import { ApiError } from '@/api/axiosClient';
import { CsvImportResult, importItemsCsv } from '@/api/services/itemService';
import { simplifySqlError } from '@/utils/sqlErrors';
import * as DocumentPicker from 'expo-document-picker';
import {
    AlertTriangle,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    Info,
    Upload,
    X,
} from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PickedFile {
    uri: string;
    name: string;
}

interface CsvImportModalProps {
    visible: boolean;
    onClose: () => void;
    onImported?: () => void; // se llama cuando insertados > 0, para refrescar el listado
}

// ⚠️ Columnas ASUMIDAS — confirmar el formato real esperado por el backend
const CSV_HEADERS = [
    'codigo',
    'nombre',
    'descripcion',
    'cantidad',
    'material',
    'estado',
    'lugar',
    'uso',
    'activo',
    'observaciones',
];

const CSV_EXAMPLE_ROWS = [
    ['CMP1', 'Casulla verde', 'Casulla color verde para tiempo ordinario', '3', 'Tela', 'Bueno', 'Sacristia', 'Litúrgico', '1', 'Uso diario'],
    ['CDP1', 'Cáliz dorado', 'Cáliz para consagración', '1', 'Metal', 'Bueno', 'Sacristia', 'Litúrgico', '1', 'Guardar en vitrina'],
];

export default function CsvImportModal({ visible, onClose, onImported }: CsvImportModalProps) {
    const [pickedFile, setPickedFile] = useState<PickedFile | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [result, setResult] = useState<CsvImportResult | null>(null);
    const [networkError, setNetworkError] = useState<string | null>(null);

    const resetState = (): void => {
        setPickedFile(null);
        setUploading(false);
        setResult(null);
        setNetworkError(null);
    };

    const handleClose = (): void => {
        const hadInserts = !!result && result.insertados > 0;
        resetState();
        onClose();
        if (hadInserts) onImported?.();
    };

    const handleTryAnotherFile = (): void => {
        setPickedFile(null);
        setResult(null);
        setNetworkError(null);
    };

    const handlePickFile = async (): Promise<void> => {
        const docResult = await DocumentPicker.getDocumentAsync({
            type: ['text/csv', 'application/vnd.ms-excel', '.csv'],
        });

        if (docResult.canceled || !docResult.assets || docResult.assets.length === 0) return;

        const asset = docResult.assets[0];
        setPickedFile({ uri: asset.uri, name: asset.name });
    };

    // Genera y descarga una plantilla de ejemplo directamente en el navegador,
    // sin depender de ningún endpoint del backend.
    const handleDownloadExample = (): void => {
        const csvContent = [
            CSV_HEADERS.join(','),
            ...CSV_EXAMPLE_ROWS.map((row) => row.join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'plantilla_articulos.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleUpload = async (): Promise<void> => {
        if (!pickedFile) return;

        try {
            setUploading(true);
            setNetworkError(null);

            const response = await importItemsCsv(pickedFile.uri, pickedFile.name);
            setResult(response.contenido);
        } catch (error) {
            const apiError = error as ApiError;
            setNetworkError(apiError.mensaje || 'Ocurrió un error al subir el archivo');
        } finally {
            setUploading(false);
        }
    };

    const showingResult = !!result || !!networkError;

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Importar artículos desde CSV</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <X size={22} color="#555" />
                        </TouchableOpacity>
                    </View>

                    {!showingResult && (
                        <>
                            <Text style={styles.description}>
                                Sube un archivo CSV para registrar varios artículos a la vez. Si es tu
                                primera vez, descarga la plantilla de ejemplo para ver el formato
                                esperado.
                            </Text>

                            <TouchableOpacity
                                style={styles.linkButton}
                                onPress={handleDownloadExample}
                                activeOpacity={0.7}
                            >
                                <Download size={16} color="#7A1F1F" />
                                <Text style={styles.linkButtonText}>
                                    Ver / descargar archivo de ejemplo
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.infoNote}>
                                <Info size={14} color="#6B7280" />
                                <Text style={styles.infoNoteText}>
                                    Si preparas el archivo en Excel, guárdalo con la opción{' '}
                                    <Text style={styles.infoNoteBold}>"CSV UTF-8 (delimitado por comas)"</Text>{' '}
                                    para evitar que los acentos y la ñ se vean corruptos al importar.
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.pickButton}
                                onPress={handlePickFile}
                                activeOpacity={0.8}
                                disabled={uploading}
                            >
                                <FileSpreadsheet size={20} color="#7A1F1F" />
                                <Text style={styles.pickButtonText} numberOfLines={1}>
                                    {pickedFile ? pickedFile.name : 'Seleccionar archivo CSV...'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.uploadButton, !pickedFile && styles.uploadButtonDisabled]}
                                onPress={handleUpload}
                                activeOpacity={0.85}
                                disabled={!pickedFile || uploading}
                            >
                                {uploading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <>
                                        <Upload size={20} color="white" />
                                        <Text style={styles.uploadButtonText}>Subir archivo</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    {networkError && (
                        <View style={[styles.summaryBox, styles.summaryError]}>
                            <AlertTriangle size={18} color="#B91C1C" />
                            <Text style={[styles.summaryText, styles.summaryTextError]}>
                                {networkError}
                            </Text>
                        </View>
                    )}

                    {result && (
                        <>
                            {result.insertados > 0 && (
                                <View style={[styles.summaryBox, styles.summarySuccess]}>
                                    <CheckCircle2 size={18} color="#3F6B34" />
                                    <Text style={[styles.summaryText, styles.summaryTextSuccess]}>
                                        {result.insertados} artículo(s) importado(s) correctamente.
                                    </Text>
                                </View>
                            )}

                            {result.errores.length > 0 && (
                                <>
                                    <View style={[styles.summaryBox, styles.summaryWarning]}>
                                        <AlertTriangle size={18} color="#8B5E00" />
                                        <Text style={[styles.summaryText, styles.summaryTextWarning]}>
                                            {result.errores.length} fila(s) no se pudieron importar:
                                        </Text>
                                    </View>

                                    <ScrollView style={styles.errorList} nestedScrollEnabled>
                                        {result.errores.map((rowError) => (
                                            <View key={rowError.fila} style={styles.errorRow}>
                                                <Text style={styles.errorRowLabel}>
                                                    Fila {rowError.fila}
                                                </Text>
                                                <Text style={styles.errorRowText}>
                                                    {simplifySqlError(rowError.error)}
                                                </Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </>
                            )}
                        </>
                    )}

                    {showingResult && (
                        <View style={styles.resultActions}>
                            {result && result.errores.length > 0 && (
                                <TouchableOpacity
                                    style={styles.secondaryButton}
                                    onPress={handleTryAnotherFile}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.secondaryButtonText}>Corregir e intentar de nuevo</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={handleClose}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.uploadButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    sheet: {
        width: '100%',
        maxWidth: 440,
        maxHeight: '85%',
        backgroundColor: '#F8F7F4',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#D9D7D2',
        padding: 20,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    title: { fontSize: 18, fontWeight: '700', color: '#7A1F1F', flex: 1, paddingRight: 10 },
    closeButton: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
    description: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 14 },
    linkButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    linkButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7A1F1F',
        marginLeft: 6,
        textDecorationLine: 'underline',
    },
    pickButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D9D7D2',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 52,
        marginBottom: 14,
    },
    pickButtonText: { fontSize: 14, color: '#1F2937', marginLeft: 10, flex: 1 },
    summaryBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },
    summarySuccess: { backgroundColor: '#E4EFE1' },
    summaryError: { backgroundColor: '#F1E1E1' },
    summaryWarning: { backgroundColor: '#FBF0DC' },
    summaryText: { fontSize: 13, marginLeft: 8, flex: 1, lineHeight: 18, fontWeight: '600' },
    summaryTextSuccess: { color: '#3F6B34' },
    summaryTextError: { color: '#8B1E1E' },
    summaryTextWarning: { color: '#8B5E00' },
    errorList: {
        maxHeight: 220,
        marginBottom: 14,
    },
    errorRow: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E3DE',
        borderRadius: 10,
        padding: 10,
        marginBottom: 6,
    },
    errorRowLabel: { fontSize: 12, fontWeight: '700', color: '#7A1F1F', marginBottom: 2 },
    errorRowText: { fontSize: 13, color: '#4B5563', lineHeight: 18 },
    resultActions: { gap: 10 },
    secondaryButton: {
        height: 48,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#D9D7D2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
    uploadButton: {
        height: 52,
        borderRadius: 14,
        backgroundColor: '#7A1F1F',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadButtonDisabled: { backgroundColor: '#C9B8B8' },
    uploadButtonText: { color: 'white', fontSize: 15, fontWeight: '700', marginLeft: 8 },
    infoNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#EFEEE9',
        borderRadius: 10,
        padding: 10,
        marginBottom: 14,
    },
    infoNoteText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 8,
        flex: 1,
        lineHeight: 17,
    },
    infoNoteBold: {
        fontWeight: '700',
        color: '#4B5563',
    },
});