import "../global.css";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: true }} />
        <Stack.Screen name="(auth)" options={{ headerShown: true }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
        
        <Stack.Screen name="+not-found" />
      </Stack>
  );
}
