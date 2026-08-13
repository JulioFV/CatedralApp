import { Check, X } from 'lucide-react-native';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface SelectOption {
  id: number;
  label: string;
  sublabel?: string;
}

interface SelectModalProps {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selectedId: number | null;
  onSelect: (option: SelectOption) => void;
  onClose: () => void;
}

export default function SelectModal({
  visible,
  title,
  options,
  selectedId,
  onSelect,
  onClose,
}: SelectModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={22} color="#555" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay opciones disponibles</Text>}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedId;
              return (
                <TouchableOpacity
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => onSelect(item)}
                  activeOpacity={0.8}
                >
                  <View>
                    <Text style={styles.optionLabel}>{item.label}</Text>
                    {item.sublabel ? <Text style={styles.optionSublabel}>{item.sublabel}</Text> : null}
                  </View>
                  {isSelected && <Check size={20} color="#7A1F1F" />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#F5F4F0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E3DE',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#7A1F1F' },
  closeButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 16, paddingTop: 8 },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 6,
  },
  optionSelected: { backgroundColor: '#F1E9D2' },
  optionLabel: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  optionSublabel: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#6B7280', paddingVertical: 30 },
});