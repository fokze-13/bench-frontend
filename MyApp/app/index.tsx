import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator, Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { ENDPOINTS } from "@/constants/api";
import { common } from "@/styles/common";
import { spacing, radius } from "@/styles/theme";
import { useSettings } from "@/hooks/useSettings";
import { useState } from "react";

export default function HomeScreen() {
  const { token, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const { colors } = useSettings();

  async function handleFindRoom() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.getSession, {
        headers: { token },
      });
      const { session_id } = await res.json();
      router.push({
        pathname: "/chat",
        params: { sessionId: session_id, token },
      });
    } catch {
      Alert.alert("Ошибка", "Не удалось найти комнату");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[common.screen, common.centered, { backgroundColor: colors.bg }]}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <View style={[styles.logoContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.bubbleLeft, { backgroundColor: colors.accent }]} />
          <View style={[styles.bubbleRight, { backgroundColor: colors.accentSoft }]} />
          <Text style={styles.logoText}>B</Text>
        </View>
        <Text style={[styles.title, { color: colors.primary }]}>Bench</Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          Анонимные групповые чаты
        </Text>
      </View>

      {/* Button Actions */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.accent }, (!token || loading) && styles.btnDisabled]}
          onPress={handleFindRoom}
          disabled={!token || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Найти комнату</Text>
          )}
        </TouchableOpacity>

        {error && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.push("/settings")}
          style={[styles.footerButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>Настройки</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/about")}
          style={[styles.footerButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>О приложении</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: spacing.md,
  },
  bubbleLeft: {
    width: 26,
    height: 26,
    borderRadius: 13,
    position: "absolute",
    top: 22,
    left: 18,
    opacity: 0.8,
  },
  bubbleRight: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: "absolute",
    bottom: 20,
    right: 14,
    opacity: 0.7,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  actionContainer: {
    width: "100%",
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  btn: {
    width: "100%",
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.md,
    shadowColor: "#4DA3FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  error: {
    marginTop: spacing.md,
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    bottom: spacing.xl,
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  footerButton: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
  },
});


