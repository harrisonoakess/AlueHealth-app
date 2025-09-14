// app/(tabs)/index.tsx
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-blue-600">
      <Text className="text-xl font-bold text-white">
        I FINALLY DID IT. MAKE SURE TO SEND TO GITHUB
      </Text>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
