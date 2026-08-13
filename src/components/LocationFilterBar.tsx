import { ScrollView, StyleSheet, View } from 'react-native';
import LocationFilterChip from './LocationFilterChip';

export type LocationOption = {
  id: number;
  code: string;
  name: string;
};

type Props = {
  locations: LocationOption[];
  selectedId: number;
  onSelect: (id: number) => void;
};

export default function LocationFilterBar({
  locations,
  selectedId,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {locations.map((location) => (
          <LocationFilterChip
            key={location.id}
            code={location.code}
            name={location.name}
            selected={location.id === selectedId}
            onPress={() => onSelect(location.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 16,
  },
});