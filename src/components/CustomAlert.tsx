import { AlertCircle, Bell, Check, Trash2, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type AlertButtonStyle = 'default' | 'cancel' | 'destructive';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: AlertButtonStyle;
}

interface AlertState {
  visible: boolean;
  title: string;
  message?: string;
  buttons: AlertButton[];
}

const initialState: AlertState = {
  visible: false,
  title: '',
  message: undefined,
  buttons: [],
};

let showAlertFn: ((title: string, message?: string, buttons?: AlertButton[]) => void) | null = null;

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AlertState>(initialState);

  useEffect(() => {
    showAlertFn = (title, message, buttons) => {
      const finalButtons: AlertButton[] =
        buttons && buttons.length > 0 ? buttons : [{ text: 'OK', style: 'default' }];
      setState({ visible: true, title, message, buttons: finalButtons });
    };

    return () => {
      showAlertFn = null;
    };
  }, []);

  const handlePress = (button: AlertButton): void => {
    setState((prev) => ({ ...prev, visible: false }));
    button.onPress?.();
  };

  const isStacked = state.buttons.length > 2;

  // Determinamos el tema general de la alerta basándonos en si hay una acción destructiva
  const isDestructiveAlert = state.buttons.some((b) => b.style === 'destructive');
  const HeaderIcon = isDestructiveAlert ? AlertCircle : Bell;
  const headerIconColor = isDestructiveAlert ? '#EF4444' : '#3B82F6';
  const headerIconBg = isDestructiveAlert ? '#FEF2F2' : '#EFF6FF';

  return (
    <>
      {children}

      <Modal
        visible={state.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setState((prev) => ({ ...prev, visible: false }))}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>

            {/* Icono de Encabezado */}
            <View style={[styles.headerIconContainer, { backgroundColor: headerIconBg }]}>
              <HeaderIcon size={28} color={headerIconColor} strokeWidth={2.5} />
            </View>

            <Text style={styles.title}>{state.title}</Text>
            {state.message ? <Text style={styles.message}>{state.message}</Text> : null}

            <View style={isStacked ? styles.buttonsColumn : styles.buttonsRow}>
              {state.buttons.map((button, index) => {
                const isCancel = button.style === 'cancel';
                const isDestructive = button.style === 'destructive';
                const isDefault = !isCancel && !isDestructive;

                // Seleccionar icono del botón
                let ButtonIcon = null;
                let iconColor = '';
                if (isDestructive) {
                  ButtonIcon = Trash2;
                  iconColor = '#EF4444';
                } else if (isCancel) {
                  ButtonIcon = X;
                  iconColor = '#475569';
                } else {
                  ButtonIcon = Check;
                  iconColor = '#FFFFFF';
                }

                return (
                  <TouchableOpacity
                    key={`${button.text}-${index}`}
                    style={[
                      styles.button,
                      isStacked ? styles.buttonStacked : styles.buttonInRow,
                      // Añadir margen entre botones dependiendo de la orientación
                      !isStacked && index > 0 && { marginLeft: 12 },
                      isStacked && index > 0 && { marginTop: 12 },
                      isCancel && styles.buttonCancel,
                      isDestructive && styles.buttonDestructive,
                      isDefault && styles.buttonDefault,
                    ]}
                    onPress={() => handlePress(button)}
                    activeOpacity={0.8}
                  >
                    <ButtonIcon size={18} color={iconColor} style={styles.buttonIcon} />
                    <Text
                      style={[
                        styles.buttonText,
                        isCancel && styles.textCancel,
                        isDestructive && styles.textDestructive,
                        isDefault && styles.textDefault,
                      ]}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

export const CustomAlert = {
  alert: (title: string, message?: string, buttons?: AlertButton[]): void => {
    if (showAlertFn) {
      showAlertFn(title, message, buttons);
    } else {
      console.warn('CustomAlert: AlertProvider no está montado en el árbol de componentes.');
    }
  },
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)', // Un fondo oscuro más elegante
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24, // Bordes más suaves
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    // Sombras para darle profundidad
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  buttonsColumn: {
    flexDirection: 'column',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14, // Botones estilo "píldora" redondeada
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInRow: {
    flex: 1,
  },
  buttonStacked: {
    width: '100%',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos visuales por tipo de botón
  buttonDefault: {
    backgroundColor: '#3B82F6', // Azul principal
  },
  textDefault: {
    color: '#FFFFFF',
  },
  buttonCancel: {
    backgroundColor: '#F1F5F9', // Gris claro
  },
  textCancel: {
    color: '#475569',
  },
  buttonDestructive: {
    backgroundColor: '#FEF2F2', // Rojo claro
  },
  textDestructive: {
    color: '#EF4444',
  },
});