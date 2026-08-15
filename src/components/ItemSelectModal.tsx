import { Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Item } from '../models/Item';

interface ItemSelectModalProps {
  visible: boolean;
  items: Item[];
  selectedId: number | null;
  onSelect: (item: Item) => void;
  onClose: () => void;
}

export default function ItemSelectModal({
  visible,
  items,
  selectedId,
  onSelect,
  onClose,
}: ItemSelectModalProps) {
  const [search, setSearch] = useState<string>('');

  const filtered = items.filter(
    (item) =>
      item.activo === 1 &&
      (item.nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.codigo.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecciona un artículo</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={22} color="#555" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre o código..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id_item.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron artículos</Text>}
            renderItem={({ item }) => {
              const disponible = item.cantidad - item.cantidad_prestada;
              const isSelected = item.id_item === selectedId;
              const sinStock = disponible <= 0;

              return (
                <TouchableOpacity
                  style={[
                    styles.option,
                    isSelected && styles.optionSelected,
                    sinStock && styles.optionDisabled,
                  ]}
                  onPress={() => !sinStock && onSelect(item)}
                  activeOpacity={sinStock ? 1 : 0.8}
                  disabled={sinStock}
                >
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionName}>{item.nombre}</Text>
                    <Text style={styles.optionSubtitle}>
                      {item.codigo} • {item.lugar}
                    </Text>
                  </View>
                  <Text style={[styles.optionStock, sinStock && styles.optionStockEmpty]}>
                    {sinStock ? 'Sin stock' : `${disponible} disp.`}
                  </Text>
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
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#7A1F1F' },
  closeButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F7F4',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDDAD4',
    paddingHorizontal: 12,
    height: 46,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: '#1F2937' },
  listContent: { paddingHorizontal: 16 },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DE',
  },
  optionSelected: { backgroundColor: '#F1E9D2', borderColor: '#C9A44C' },
  optionDisabled: { opacity: 0.5 },
  optionInfo: { flex: 1, marginRight: 10 },
  optionName: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  optionSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  optionStock: { fontSize: 12, fontWeight: '700', color: '#3F6B34' },
  optionStockEmpty: { color: '#B91C1C' },
  emptyText: { textAlign: 'center', color: '#6B7280', paddingVertical: 30 },
});