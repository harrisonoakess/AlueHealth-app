// app/(root)/(tabs)/profile/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, type Href } from "expo-router";
import {
  ChevronRight,
  User,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react-native";
import { supabase } from "../../../../lib/supabase";

type IconProps = { size?: number; color?: string };
type IconType = React.ComponentType<IconProps>;

type MenuItem = {
  icon: IconType;
  label: string;
  to: Href;          // make sure these paths exist in your app
  danger?: boolean;
};

export default function Profile() {
  const [profileName, setProfileName] = useState<string | null>(null);
  const [joinedAt, setJoinedAt] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          if (active) {
            setProfileName(null);
            setJoinedAt(null);
            setUserEmail(null);
          }
          return;
        }

        if (active) {
          setUserEmail(user.email ?? null);
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, created_at")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (!active) return;

        const nameFromProfile = data?.full_name?.trim() ?? null;
        const nameFromMetadata = typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name.trim()
          : null;

        setProfileName(nameFromProfile || nameFromMetadata || null);
        setJoinedAt(data?.created_at ?? user.created_at ?? null);
      } catch (error) {
        console.error("Failed to load profile information", error);
        if (active) {
          setProfileName(null);
          setJoinedAt(null);
        }
      } finally {
        if (active) {
          setLoadingProfile(false);
        }
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const resolvedName = useMemo(() => {
    if (loadingProfile) return "Loading...";
    const preferred = profileName?.trim();
    if (preferred) return preferred;
    if (userEmail) return userEmail;
    return "Welcome back";
  }, [loadingProfile, profileName, userEmail]);

  const initials = useMemo(() => {
    const source = profileName?.trim() || userEmail?.trim() || "";
    if (!source) return "AL";
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "AL";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [profileName, userEmail]);

  const joined = useMemo(() => {
    if (loadingProfile) return "Fetching account info...";
    if (!joinedAt) return "Joined recently";
    const parsed = new Date(joinedAt);
    if (Number.isNaN(parsed.getTime())) return "Joined recently";
    const formatted = new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(parsed);
    return `Joined ${formatted}`;
  }, [joinedAt, loadingProfile]);

  const menuItems: MenuItem[] = [
    { icon: User, label: "Edit Profile", to: "/(root)/(tabs)/profile/editProfile" as Href },
    { icon: Bell, label: "Notifications", to: "/(root)/(tabs)/profile/notifications" as Href },
    { icon: Settings, label: "App Settings", to: "/(root)/(tabs)/profile/settings" as Href },
    { icon: HelpCircle, label: "Support", to: "/(root)/(tabs)/profile/support" as Href },
    { icon: LogOut, label: "Log Out", to: "/(root)/(tabs)/profile/logout" as Href, danger: true },
    { icon: LogOut, label: "Pricing", to: "/(root)/(tabs)/profile/pricing" as Href,},

  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FB" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Avatar */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <Text style={styles.name}>{resolvedName}</Text>
          <Text style={styles.joined}>{joined}</Text>
        </View>

        {/* Menu — soft opacity/tint rows */}
        <View style={{ gap: 40 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const danger = !!item.danger;

            const baseBg = danger ? "rgba(239, 68, 68, 0.06)" : "rgba(108, 99, 255, 0.06)";
            const pressedBg = danger ? "rgba(239, 68, 68, 0.14)" : "rgba(108, 99, 255, 0.14)";
            const iconColor = danger ? "#ef4444" : "#6C63FF";
            const labelColor = danger ? "#ef4444" : "#111827";
            const chevColor = danger ? "#ef4444" : "#6B7280";

            return (
              <Link key={item.label} href={item.to} asChild>
                <Pressable
                  android_ripple={{
                    color: danger ? "rgba(239,68,68,0.15)" : "rgba(108,99,255,0.15)",
                    borderless: false,
                  }}
                  style={({ pressed }) => [
                    styles.opacityRow,
                    { backgroundColor: pressed ? pressedBg : baseBg },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <View style={styles.row}>
                      <Icon size={22} color={iconColor} />
                      <Text style={[styles.label, { color: labelColor }]}>
                        {item.label}
                      </Text>
                    </View>
                    <ChevronRight size={20} color={chevColor} />
                  </View>
                </Pressable>
              </Link>
            );
          })}
        </View>

        <Text style={styles.version}>AlueHealth v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Avatar
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "#E9E8FF",
    borderWidth: 4,
    borderColor: "rgba(108,99,255,1)",
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(108,99,255,0.15)",
  },
  avatarText: { fontSize: 28, fontWeight: "700", color: "#6C63FF" },

  // Header text
  name: { fontSize: 22, fontWeight: "600", color: "#111827" },
  joined: { marginTop: 4, color: "#6B7280" },

  // Opacity row (replaces the old 'card' style)
  opacityRow: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,                 // keep a faint edge; set to 0 or "transparent" to remove
    borderColor: "rgba(0,0,0,0.06)",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 1 },
    }),
  },

  // Row layout
  row: { flexDirection: "row", alignItems: "center", gap: 15 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  // Typography (kept your sizes)
  label: { fontSize: 25, fontWeight: "300" },
  version: { textAlign: "center", marginTop: 24, fontSize: 12, color: "#6B7280" },
});
