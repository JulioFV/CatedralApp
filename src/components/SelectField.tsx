import { ChevronDown } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
  error?: string;
}

export default function SelectField({
  label,
  value,
  placeholder = 'Selecciona una opción',
  onPress,
  error,
}: SelectFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.field, error && styles.fieldError]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.value, !value && styles.placeholder]}>{value || placeholder}</Text>
        <ChevronDown size={20} color="#9CA3AF" />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 6 },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F7F4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDDAD4',
    paddingHorizontal: 14,
    height: 52,
  },
  fieldError: { borderColor: '#B91C1C' },
  value: { fontSize: 16, color: '#1F2937' },
  placeholder: { color: '#9CA3AF' },
  errorText: { fontSize: 12, color: '#B91C1C', marginTop: 4 },
});