import { Platform } from "react-native";

const HOST = Platform.select({
  android: "192.168.100.7",
  ios: "localhost",
  default: "192.168.100.7",
});

export const UrlBase = `http://localhost/ApiCatedral/public/`;