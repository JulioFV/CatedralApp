import { Pencil } from 'lucide-react-native';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type LocationItemCardProps = {
    name: string;
    code?: string;
    description: string;
    manager?: string;
    onPress?: () => void;
    onEdit?: () => void;
};

export default function ItemLocation({
    name,
    code,
    description,
    manager,
    onPress,
    onEdit,
}: LocationItemCardProps) {
    return (<TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={onPress}
    > <View style={styles.content}> <View style={styles.headerRow}> <Text style={styles.name}>{name}</Text>

        {code ? (
            <Text style={styles.code}> ({code})</Text>
        ) : null}
    </View>

            <Text style={styles.description}>{description}</Text>

            {manager ? (
                <Text style={styles.manager}>RESP: {manager}</Text>
            ) : null}
        </View>

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
        alignItems: 'flex-start',
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

    headerRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 6,
    },

    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },

    code: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },

    description: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 8,
    },

    manager: {
        fontSize: 12,
        fontWeight: '700',
        color: '#C9A44C',
        letterSpacing: 0.4,
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
