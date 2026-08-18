import { AlertProvider } from '@/components/CustomAlert';
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function Layout() {
  return (
    <AlertProvider>
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
    </AlertProvider>
  );
}
