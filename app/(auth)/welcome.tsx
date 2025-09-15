import { useRef } from "react"
import { View, Text, TouchableOpacity, FlatList, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Link } from "expo-router"

const { width } = Dimensions.get("window")

const slides = [
  {
    id: "1",
    title: "Welcome 👋",
    description: "Thanks for joining! Let’s get you started.",
  },
  {
    id: "2",
    title: "Stay Connected",
    description: "Easily manage your experience with our app.",
  },
  {
    id: "3",
    title: "Get Started",
    description: "Sign in or create an account to continue.",
    isLast: true,
  },
]

export default function Welcome() {
  const flatListRef = useRef<FlatList>(null)

  return (
    <SafeAreaView className="flex-1 bg-primary-500">
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-1 items-center justify-center px-6" style={{ width }}>
            <Text className="text-4xl font-JakartaExtraBold text-white mb-4">
              {item.title}
            </Text>
            <Text className="text-lg font-Jakarta text-white text-center mb-10">
              {item.description}
            </Text>

            {item.isLast && (
              <View className="w-full">
                {/* Sign In */}
                <Link href="/sign-in" asChild>
                  <TouchableOpacity className="w-full bg-white py-3 rounded-2xl mb-4">
                    <Text className="font-JakartaSemiBold text-primary-500 text-center">
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </Link>

                {/* Sign Up */}
                <Link href="/sign-up" asChild>
                  <TouchableOpacity className="w-full border-2 border-white py-3 rounded-2xl">
                    <Text className="font-JakartaSemiBold text-white text-center">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  )
}
