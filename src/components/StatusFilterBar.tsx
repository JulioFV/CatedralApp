import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface StatusOption {
    id: number; // 0 = Todos, 1 = Activo, 2 = Devuelto
    label: string;
}

interface StatusFilterBarProps {
    options: StatusOption[];
    selectedId: number;
    onSelect: (id: number) => void;
}

export default function StatusFilterBar({ options, selectedId, onSelect }: StatusFilterBarProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {options.map((option) => {
                const isSelected = option.id === selectedId;
                return (
                    <TouchableOpacity
                        key={option.id}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => onSelect(option.id)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16, paddingBottom: 16, },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: '#F8F7F4',
        borderWidth: 1,
        borderColor: '#DDDAD4',
        marginRight: 8,
        
    },
    chipSelected: { backgroundColor: '#7A1F1F', borderColor: '#7A1F1F' },
    chipText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
    chipTextSelected: { color: 'white' },
});