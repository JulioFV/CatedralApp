import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  code: string;
  name: string;
  selected?: boolean;
  onPress: () => void;
};

export default function LocationFilterChip({
  code,
  name,
  selected = false,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, selected && styles.containerSelected]}
    >
      <View style={styles.content}>
        <Text style={[styles.code, selected && styles.codeSelected]}>
          {code}
        </Text>

        <Text
          style={[styles.name, selected && styles.nameSelected]}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 86,
    height: 76,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D7D2C8',
    backgroundColor: '#F8F7F4',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerSelected: {
    borderColor: '#C9A44C',
    backgroundColor: '#F7F2E4',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  code: {
    fontSize: 18,
    fontWeight: '700',
    color: '#555',
    marginBottom: 4,
  },
  codeSelected: {
    color: '#C9A44C',
  },
  name: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  nameSelected: {
    color: '#8A6A22',
    fontWeight: '600',
  },
});