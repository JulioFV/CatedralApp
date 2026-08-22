import { Platform } from "react-native";

// --- Aplicación de escritorio (Tauri) y navegador web ---
// Uso exclusivo dentro de la LAN de la parroquia. Sin SSL a propósito,
// ya que todos los dispositivos están en la misma red local.
const LAN_SERVER_URL = "http://192.168.100.7/ApiCatedral/public/";

// --- Aplicación móvil (Android/iOS) ---
// Expuesta vía ngrok para dar acceso fuera de la LAN.
// ⚠️ Con el plan gratuito de ngrok, esta URL cambia cada vez que se
// reinicia el túnel. Este valor es solo el "de fábrica" — en cuanto
// cambie, no hace falta recompilar el .apk: se puede actualizar desde
// la pantalla de Configuración del Servidor (acceso oculto en Login),
// que ya persiste la URL real en el dispositivo.
const NGROK_SERVER_URL = "https://TU-SUBDOMINIO-ACTUAL.ngrok-free.app/ApiCatedral/public/";

export const DEFAULT_URL_BASE = (
  Platform.OS === "android" || Platform.OS === "ios"
    ? NGROK_SERVER_URL
    : LAN_SERVER_URL // web y Tauri (escritorio empaquetado)
);