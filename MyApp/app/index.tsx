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
import { colors, spacing } from "@/styles/theme";
import { useState } from "react";

export default function HomeScreen() {
  const { token, error } = useAuth();
  const [loading, setLoading] = useState(false);

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
    <View style={[common.screen, common.centered]}>
      <Text style={styles.title}>Bench</Text>

      <TouchableOpacity
        style={[styles.btn, (!token || loading) && styles.btnDisabled]}
        onPress={handleFindRoom}
        disabled={!token || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Найти комнату</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Text style={styles.link}>Настройки</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/about")}>
          <Text style={styles.link}>О приложении</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  btn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  error: { color: colors.danger, marginTop: spacing.md },
  footer: {
    position: "absolute",
    bottom: spacing.xl,
    flexDirection: "row",
    gap: spacing.lg,
  },
  link: { color: colors.secondary, fontSize: 14 },
});
