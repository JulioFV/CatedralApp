import { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type MenuCardProps = {
    title: string;
    icon: LucideIcon;
    description: string;
    color: string;
    onPress: () => void;
};

export default function MenuCard({
    title,
    description,
    icon: Icon,
    color,
    onPress,
}: MenuCardProps) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
            <View style={[styles.iconContainer, {backgroundColor: color}]}>
                <Icon size={24} color="#fff" />
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 160,
        backgroundColor: '#F4F3F0',
        borderRadius: 22,
        padding: 18,
        borderWidth:1,
        borderColor: '#D9D7D2',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});