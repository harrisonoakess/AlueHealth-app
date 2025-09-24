import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, Link } from "expo-router"
import { supabase } from "../../lib/supabase"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

const handleSignUp = async () => {
  setErrorMessage("")

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    setErrorMessage(error.message)
    return
  }

  // ✅ Get user explicitly
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: null,
      date_of_birth: null,
      height_cm: null,
      weight_kg: null,
      child_number: null,
      due_date: null,
      onboarding_complete: false, // make sure this column exists
    })
  }

  // ✅ Redirect to Welcome
  router.replace("/(auth)/(onboarding)/welcome")
}



  return (
    <SafeAreaView className="flex-1 bg-primary-500 px-6">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-JakartaExtraBold text-white mb-8">
          Create Account
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#CED1DD"
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
          onPress={handleSignUp}
          className="w-full bg-white py-3 rounded-2xl mb-4"
        >
          <Text className="font-JakartaSemiBold text-primary-500 text-center">
            Sign Up
          </Text>
        </TouchableOpacity>

        {/* Already have account? */}
        <Text className="text-white text-center font-Jakarta mt-2">
          Already have an account?{" "}
          <Link href="/(auth)/sign-in" className="text-warning-300 font-JakartaSemiBold">
            Sign In
          </Link>
        </Text>

        {errorMessage ? (
          <Text className="text-red-500 text-center mt-4">{errorMessage}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  )
}
