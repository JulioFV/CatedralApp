import { ChevronRight } from 'lucide-react-native';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type LoanItemCardProps = {
itemName: string;
borrower: string;
date: string;
status?: 'ACTIVO' | 'DEVUELTO' | 'VENCIDO';
onPress?: () => void;
onDetails?: () => void;
};

export default function ItemLoan({
itemName,
borrower,
date,
status = 'ACTIVO',
onPress,
onDetails,
}: LoanItemCardProps) {
const badgeStyle =
status === 'ACTIVO'
? styles.activeBadge
: status === 'DEVUELTO'
? styles.returnedBadge
: styles.overdueBadge;

const badgeTextStyle =
status === 'ACTIVO'
? styles.activeText
: status === 'DEVUELTO'
? styles.returnedText
: styles.overdueText;

return ( <TouchableOpacity
   style={styles.card}
   activeOpacity={0.85}
   onPress={onPress}
 >
{/* Encabezado */} <View style={styles.header}> <View style={styles.info}> <Text style={styles.title}>{itemName}</Text> <Text style={styles.borrower}>Solicitante: {borrower}</Text> </View>

    <View style={[styles.badge, badgeStyle]}>
      <Text style={[styles.badgeText, badgeTextStyle]}>
        {status}
      </Text>
    </View>
  </View>

  {/* Separador */}
  <View style={styles.divider} />

  {/* Pie */}
  <View style={styles.footer}>
    <Text style={styles.date}>{date}</Text>

    <TouchableOpacity
      style={styles.detailsButton}
      onPress={onDetails}
      activeOpacity={0.8}
    >
      <Text style={styles.detailsText}>Editar Prestamo</Text>
      <ChevronRight size={16} color='#7A1F1F' />
    </TouchableOpacity>
  </View>
</TouchableOpacity>

);
}

const styles = StyleSheet.create({
card: {
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

header: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'flex-start',
},

info: {
flex: 1,
paddingRight: 10,
},

title: {
fontSize: 18,
fontWeight: '700',
color: '#1F2937',
marginBottom: 4,
},

borrower: {
fontSize: 14,
color: '#4B5563',
},

badge: {
paddingHorizontal: 10,
paddingVertical: 5,
borderRadius: 999,
},

badgeText: {
fontSize: 11,
fontWeight: '700',
letterSpacing: 0.5,
},

activeBadge: {
backgroundColor: '#E9D8A6',
},

activeText: {
color: '#6B5A1A',
},

returnedBadge: {
backgroundColor: '#DCEAD7',
},

returnedText: {
color: '#355E3B',
},

overdueBadge: {
backgroundColor: '#F5D6D6',
},

overdueText: {
color: '#8B1E1E',
},

divider: {
height: 1,
backgroundColor: '#E5E3DE',
marginVertical: 14,
},

footer: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
},

date: {
fontSize: 13,
color: '#9CA3AF',
},

detailsButton: {
flexDirection: 'row',
alignItems: 'center',
},

detailsText: {
fontSize: 14,
fontWeight: '600',
color: '#7A1F1F',
marginRight: 4,
},
});
