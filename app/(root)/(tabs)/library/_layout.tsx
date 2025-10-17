import { Stack } from "expo-router";

export default function LibraryStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Library",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="breathing" options={{ title: "Breathing Through Anxiety" }} />
    </Stack>
  );
}
