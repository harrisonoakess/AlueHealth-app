import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  return (
    <Redirect href="/(auth)/welcome" />
  );
};

export default HomeScreen;  