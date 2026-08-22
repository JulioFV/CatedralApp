import { setAxiosBaseUrl } from '@/api/axiosClient';
import { AlertProvider } from '@/components/CustomAlert';
import { getStoredServerUrl } from '@/utils/serverConfig';
import { Slot } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";



export default function Layout() {
  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => {
    const bootstrap = async (): Promise<void> => {
      const storedUrl = await getStoredServerUrl();
      if (storedUrl) {
        setAxiosBaseUrl(storedUrl);
      }
      setReady(true);
    };
    bootstrap();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F4F0' }}>
        <ActivityIndicator size="large" color="#7A1F1F" />
      </View>
    );
  }
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </AlertProvider>
  );
}
