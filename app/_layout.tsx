import { NotificationProvider } from "@/components/NotificationProvider";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  
  return (
    <NotificationProvider>
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
    </NotificationProvider>
  );
}
