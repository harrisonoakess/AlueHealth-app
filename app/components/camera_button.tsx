import { Button } from "react-native";
import { useRouter } from "expo-router";

export default function CameraButton() {
  const router = useRouter();
  return <Button title="Take a Photo" onPress={() => router.push("/camera")} />;
}
