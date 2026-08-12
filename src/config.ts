import { Platform } from "react-native";

const HOST = Platform.select({
  android: "192.168.100.7",
  ios: "localhost",
  default: "192.168.100.7",
});

export const UrlBase = `https://40ef-38-137-252-200.ngrok-free.app/ApiCatedral/public/`;