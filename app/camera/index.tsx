import { useRef } from "react";
import { View, Button } from "react-native";
import { CameraView, useCameraPermissions, CameraCapturedPicture } from "expo-camera";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function CameraScreen() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const params = useLocalSearchParams();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center">
        <Button title="Grant Camera Permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync();
      console.log("Photo taken:", photo.uri);

      if (params.returnTo) {
        router.replace({
          pathname: params.returnTo as any, // 👈 force-cast
          params: { newPhoto: photo.uri },
        });
      } else {
        router.back();
      }
    }
  };

  return (
    <CameraView ref={cameraRef} style={{ flex: 1 }}>
      <View className="absolute bottom-10 self-center">
        <Button title="Take Photo" onPress={takePicture} />
      </View>
    </CameraView>
  );
}
