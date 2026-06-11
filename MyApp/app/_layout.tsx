import { Stack } from "expo-router";
import { SettingsProvider, useSettings } from "@/hooks/useSettings";
import { StatusBar } from "expo-status-bar";

function AppContent() {
  const { isDark } = useSettings();
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
