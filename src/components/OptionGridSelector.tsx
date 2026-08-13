import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type OptionItem = {
  id: string | number;
  label: string;
};

type Props = {
  label: string;
  options: OptionItem[];
  selectedId: string | number | null;
  onSelect: (id: string | number) => void;
  columns?: number;
};

export default function OptionGridSelector({
  label,
  options,
  selectedId,
  onSelect,
  columns = 2,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <FlatList
        data={options}
        keyExtractor={(item) => item.id.toString()}
        numColumns={columns}
        scrollEnabled={false}
        columnWrapperStyle={columns > 1 ? styles.row : undefined}
        renderItem={({ item }) => {
          const selected = item.id === selectedId;

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onSelect(item.id)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Text
                style={[
                  styles.optionText,
                  selected && styles.optionTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    letterSpacing: 0.6,
    marginBottom: 10,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  option: {
    flex: 1,
    minHeight: 78,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#D9D7D2',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginHorizontal: 2,
  },

  optionSelected: {
    borderColor: '#C9A44C',
    backgroundColor: '#F7F2E4',
  },

  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 18,
  },

  optionTextSelected: {
    color: '#8A6A22',
    fontWeight: '700',
  },
});