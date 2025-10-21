// app/(root)/(tabs)/profile.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, type Href, useRouter } from "expo-router";
import {
  ChevronRight,
  User,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react-native";

type IconProps = { size?: number; color?: string };
type IconType = React.ComponentType<IconProps>;

type MenuItem = {
  icon: IconType;
  label: string;
  to: Href;          // ensure this matches an existing route file
  danger?: boolean;  // optional, fixes the "danger is red"
};

export default function Profile() {
  // Adjust these paths to your actual files; e.g. app/(root)/(tabs)/settings.tsx -> "/(root)/(tabs)/settings"
  const menuItems: MenuItem[] = [
    { icon: User, label: "Edit Profile", to: "/(root)/(tabs)/edit-profile" as Href },
    { icon: Bell, label: "Notifications", to: "/(root)/(tabs)/notifications" as Href },
    { icon: Settings, label: "App Settings", to: "/(root)/(tabs)/settings" as Href },
    { icon: HelpCircle, label: "Support", to: "/(root)/(tabs)/support" as Href },
    { icon: LogOut, label: "Log Out", to: "/(root)/(tabs)/logout" as Href, danger: true },
  ];

  // Replace with real user data
  const initials = "EJ";
  const name = "Emma Johnson";
  const joined = "Joined June 2025";

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
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.joined}>{joined}</Text>
        </View>

        {/* Menu */}
        <View style={{ gap: 40 }}> 
          {menuItems.map((item) => {
            const Icon = item.icon;
            const danger = !!item.danger;
            const iconColor = danger ? "#ef4444" : "#6C63FF";
            const labelColor = danger ? "#ef4444" : "#111827";
            const chevronColor = danger ? "#ef4444" : "#6B7280";

            return (
              <Link key={item.label} href={item.to} asChild>
                <Pressable
                  style={({ pressed }) => [
                    styles.card,
                    { opacity: pressed ? 0.9 : 1 },
                    danger && { backgroundColor: "rgba(239,68,68,0.06)" },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <View style={styles.row}>
                      <Icon size={20} color={iconColor} />
                      <Text style={[styles.label, { color: labelColor }]}>
                        {item.label}
                      </Text>
                    </View>
                    <ChevronRight size={20} color={chevronColor} />
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
  name: { fontSize: 22, fontWeight: "600", color: "#111827" },
  joined: { marginTop: 4, color: "#6B7280" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 0,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  row: { flexDirection: "row", alignItems: "center", gap: 15 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 25, fontWeight: "300" },
  version: { textAlign: "center", marginTop: 24, fontSize: 12, color: "#6B7280" },
});
