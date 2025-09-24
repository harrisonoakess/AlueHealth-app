import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, Link } from "expo-router"
import { supabase } from "../../lib/supabase"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const afterLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Check onboarding flag
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle()

    if (error) {
      setErrorMessage(error.message)
      return
    }

    if (!profile || !profile.onboarding_complete) {
      router.replace("/(auth)/(onboarding)/enter_info")
    } else {
      router.replace("/(root)/(tabs)/home")
    }
  }

  const handleSignIn = async () => {
  setErrorMessage("")

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    setErrorMessage(error.message)
    return
  }

  // ✅ Go to Welcome
  router.replace("/(auth)/(onboarding)/welcome")
}

  const handleSkipLogin = async () => {
    setErrorMessage("")
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: "xorej44434@camjoint.com",
      password: "password",
    })
    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    await afterLogin()
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-500 px-6">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-JakartaExtraBold text-white mb-8">
          Sign In
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#CED1DD"
          keyboardType="email-address"
          autoCapitalize="none"
          className="w-full bg-white rounded-xl px-4 py-3 mb-4 font-Jakarta"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#CED1DD"
          secureTextEntry
          className="w-full bg-white rounded-xl px-4 py-3 mb-6 font-Jakarta"
        />

        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          className={`w-full py-3 rounded-2xl mb-3 ${loading ? "bg-white/80" : "bg-white"}`}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text className="font-JakartaSemiBold text-primary-500 text-center">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSkipLogin}
          disabled={loading}
          className="w-full border border-white/70 py-3 rounded-2xl mb-6"
        >
          <Text className="font-JakartaSemiBold text-white text-center">
            Skip login (use test account)
          </Text>
        </TouchableOpacity>

        {errorMessage ? (
          <Text className="text-red-300 text-center mb-3">{errorMessage}</Text>
        ) : null}

        <Text className="text-white text-center font-Jakarta">
          Don’t have an account?{" "}
          <Link href="/(auth)/sign-up" className="text-warning-300 font-JakartaSemiBold">
            Sign Up
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  )
}
