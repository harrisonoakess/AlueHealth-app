import { View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-JakartaExtraBold text-primary-600">
          Home
        </Text>
        <Text className="text-lg font-Jakarta text-neutral-700 mt-2">
          Welcome to your home screen
        </Text>
      </View>
    </SafeAreaView>
  )
}
