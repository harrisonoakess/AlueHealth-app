import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

// Background for the tab bar (safe everywhere)
export default function BlurTabBarBackground() {
  return (
    <BlurView
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

// Safe hook: won't crash if called outside Tabs.Navigator
export function useBottomTabOverflow() {
  try {
    return useBottomTabBarHeight();
  } catch {
    return 0; // fallback height when no tab bar context
  }
}
