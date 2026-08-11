import { Pencil } from 'lucide-react-native';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type CategoryItemCardProps = {
    title: string;
    description: string;
    status?: 'ACTIVO' | 'INACTIVO';
    onPress?: () => void;
    onEdit?: () => void;
};

export default function ItemUses({
    title,
    description,
    status = 'ACTIVO',
    onPress,
    onEdit,
}: CategoryItemCardProps) {
    const badgeStyle =
        status === 'ACTIVO' ? styles.activeBadge : styles.inactiveBadge;

    const badgeTextStyle =
        status === 'ACTIVO' ? styles.activeText : styles.inactiveText;

    return (<TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={onPress}
    >
        {/* Contenido principal */} <View style={styles.content}> <Text style={styles.title}>{title}</Text>

            <Text style={styles.description}>
                {description}
            </Text>

            <View style={[styles.badge, badgeStyle]}>
                <Text style={[styles.badgeText, badgeTextStyle]}>
                    {status}
                </Text>
            </View>
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
        backgroundColor: '#F5F4F0',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#D9D7D2',
        padding: 16,
        marginVertical: 6,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,

    },

    content: {
        flex: 1,
        paddingRight: 12,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },

    description: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
        marginBottom: 14,
    },

    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
    },

    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    activeBadge: {
        backgroundColor: '#E9E6D5',
        borderColor: '#C9C4B5',
    },

    activeText: {
        color: '#55624A',
    },

    inactiveBadge: {
        backgroundColor: '#F0E1E1',
        borderColor: '#D8B8B8',
    },

    inactiveText: {
        color: '#8B1E1E',
    },

    editButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#EFEEE9',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
