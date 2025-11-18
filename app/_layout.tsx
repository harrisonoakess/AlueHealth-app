import "../global.css"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "react-native-reanimated"
import { useEffect } from "react"
import { warmBackend } from "../lib/backendWarmup"

export default function RootLayout() {
  useEffect(() => {
    warmBackend()
  }, [])

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(root)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  )
}





// // Use below here for finding WARN locations:
// import { Stack } from "expo-router"
// import { LogBox } from "react-native"
// import { useEffect } from "react"

// export default function RootLayout() {
//   useEffect(() => {
//     // Don’t ignore warnings
//     LogBox.ignoreAllLogs(false)

//     // Force warnings to throw as errors so you see the source
//     const oldWarn = console.warn
//     console.warn = (...args) => {
//       throw new Error(args.join(" "))
//     }

//     return () => {
//       console.warn = oldWarn // restore on unmount
//     }
//   }, [])

//   return <Stack screenOptions={{ headerShown: false }} />
// }
