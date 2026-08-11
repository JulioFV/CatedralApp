import { LucideIcon, Package, Pencil } from 'lucide-react-native';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type ItemCardProps = {
    title: string;
    subtitle: string;
    icon?: LucideIcon;
    iconColor?: string;
    onPress?: () => void;
    onEdit?: () => void;
};

export default function ItemCard({
    title,
    subtitle,
    icon: Icon = Package,
    iconColor = '#C9A44C',
    onPress,
    onEdit,
}: ItemCardProps) {
    return (<TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={onPress}
    >
        {/* Icono */}
        <View style={[styles.iconContainer, { backgroundColor: '#F3F1EB' }]}> <Icon size={22} color={iconColor} /> </View>
        {/* Información */}
        <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
                {title}
            </Text>

            <Text style={styles.subtitle} numberOfLines={2}>
                {subtitle}
            </Text>
        </View>

        {/* Botón editar */}
        <TouchableOpacity
            style={styles.editButton}
            onPress={onEdit}
            activeOpacity={0.8}
        >
            <Pencil size={18} color='#6B6B6B' />
        </TouchableOpacity>
    </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F4F0',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#D9D7D2',
        padding: 14,
        marginVertical: 6,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,


    },

    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    info: {
        flex: 1,
    },

    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 3,
    },

    subtitle: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },

    editButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#EFEEE9',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
});
