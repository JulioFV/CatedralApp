import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


const STORAGE_KEY = 'server_url_override';

export const getStoredServerUrl = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setStoredServerUrl = async (url: string): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, url);
};

export const clearStoredServerUrl = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};

export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const normalizeBaseUrl = (url: string): string => {
  const trimmed = url.trim();
  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
};
export interface ConnectionTestResult {
  ok: boolean;
  message: string;
}

export const testServerConnection = async (url: string): Promise<ConnectionTestResult> => {
  const normalized = normalizeBaseUrl(url);

  try {
    const response = await axios.get(`${normalized}areas`, {
      timeout: 6000,
      headers: normalized.includes("ngrok") ? { "ngrok-skip-browser-warning": "true" } : {},
    });

    if (response.status >= 200 && response.status < 300) {
      return { ok: true, message: "Conexión exitosa con el servidor." };
    }
    return { ok: false, message: `El servidor respondió con estado ${response.status}.` };
  } catch (error) {
    return { ok: false, message: "No se pudo conectar con esa dirección. Verifica la URL." };
  }
};