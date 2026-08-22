import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const PIN_KEY = 'admin_settings_pin_hash';

// ⚠️ Cámbialo la primera vez que accedas a Configuración del servidor.
const DEFAULT_PIN = '0000';

const hashPin = async (pin: string): Promise<string> => {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
};

export const isPinCustomized = async (): Promise<boolean> => {
  const stored = await AsyncStorage.getItem(PIN_KEY);
  return !!stored;
};

export const verifyPin = async (pin: string): Promise<boolean> => {
  const stored = await AsyncStorage.getItem(PIN_KEY);
  const expectedHash = stored ?? (await hashPin(DEFAULT_PIN));
  const inputHash = await hashPin(pin);
  return inputHash === expectedHash;
};

export const setPin = async (pin: string): Promise<void> => {
  const hash = await hashPin(pin);
  await AsyncStorage.setItem(PIN_KEY, hash);
};