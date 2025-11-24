import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function HomeScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const routeToStack = (isAuthed: boolean) => {
      router.replace(isAuthed ? "/(root)/(tabs)/checkIn" : "/(auth)/sign-in");
    };

    const run = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!isMounted) return;
        routeToStack(!!session);
      } finally {
        if (isMounted) setChecking(false);
      }
    };

    run();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      routeToStack(!!session);
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  if (!checking) return null;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#7B53A6" />
    </View>
  );
}
