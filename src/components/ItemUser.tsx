import { Pencil, User } from 'lucide-react-native';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type UserItemCardProps = {
    name: string;
    apep: string;
    apm: string;
    role: string;
    onPress?: () => void;
    onEdit?: () => void;
};

export default function UserItemCard({
    name,
    apep,
    apm,
    role,
    onPress,
    onEdit,
}: UserItemCardProps) {
    return (<TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={onPress}
    >
        {/* Avatar */} <View style={styles.avatar}> <User size={22} color='#6B6B6B' /> </View>

        {/* Información */}
        <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
                {name} {apep} {apm}
            </Text>

            <Text style={styles.role} numberOfLines={1}>
                {role}
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

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFEEE9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    info: {
        flex: 1,
    },

    name: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 3,
    },

    role: {
        fontSize: 14,
        color: '#C9A44C',
        fontWeight: '600',
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
