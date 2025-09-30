import { View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Checkin() {
  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-JakartaExtraBold text-primary-600">
          Check-In
        </Text>
        <Text className="text-lg font-Jakarta text-neutral-700 mt-2">
          Daily check-in page
        </Text>
      </View>
    </SafeAreaView>
  )
}




// import React, { useState } from "react";
// import { View, Text, Button } from "react-native";
// import { BACKEND_URL } from "../../../config"; // import your URL

// export default function TestBackendScreen() {
//   const [message, setMessage] = useState("");

//   async function testBackend() {
//     try {
//       const res = await fetch(`${BACKEND_URL}/`);
//       const data = await res.json();
//       setMessage(data.message);
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error connecting to backend");
//     }
//   }

//   async function testOpenAI() {
//     try {
//       const res = await fetch(`${BACKEND_URL}/test-openai`);
//       const data = await res.json();
//       setMessage(JSON.stringify(data.openai_response ?? data));
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error calling OpenAI");
//     }
//   }

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Button title="Test Backend" onPress={testBackend} />
//       <Button title="Test OpenAI" onPress={testOpenAI} />
//       <Text style={{ marginTop: 20, padding: 10 }}>{message}</Text>
//     </View>
//   );
// }





