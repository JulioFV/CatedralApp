import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

export default function Layout() {
  useEffect(() => {
    async function enableImmersiveMode() {
      // Oculta la barra de navegación (Android)
      await NavigationBar.setVisibilityAsync("hidden");
    }

    enableImmersiveMode();
  }, []);
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
