import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSettings } from "@/hooks/useSettings";
import { spacing, radius } from "@/styles/theme";
import { fetchToken } from "@/utils/auth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { settings, updateSetting, colors, isDark } = useSettings();
  const [resetting, setResetting] = useState(false);

  async function handleResetIdentity() {
    Alert.alert(
      "Сброс профиля",
      "Вы уверены, что хотите сбросить текущую личность? Будет создан новый уникальный токен.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Сбросить",
          style: "destructive",
          onPress: async () => {
            setResetting(true);
            try {
              await fetchToken();
              Alert.alert("Успешно", "Ваша анонимная личность успешно обновлена!");
            } catch (e) {
              Alert.alert("Ошибка", "Не удалось сбросить профиль");
            } finally {
              setResetting(false);
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.accent }]}>← Назад</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Настройки</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Appearance Card */}
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Внешний вид</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View>
              <Text style={[styles.rowTitle, { color: colors.primary }]}>Темная тема</Text>
              <Text style={[styles.rowSubtitle, { color: colors.secondary }]}>Переключение тем оформления</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(val) => updateSetting("theme", val ? "dark" : "light")}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={isDark ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Chat Preferences */}
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Чат</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.row, styles.divider, { borderBottomColor: colors.border }]}>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowTitle, { color: colors.primary }]}>Отправка по Enter</Text>
              <Text style={[styles.rowSubtitle, { color: colors.secondary }]}>Отправлять сообщения клавишей Enter</Text>
            </View>
            <Switch
              value={settings.sendOnEnter}
              onValueChange={(val) => updateSetting("sendOnEnter", val)}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={settings.sendOnEnter ? "#fff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowTitle, { color: colors.primary }]}>Вибрация</Text>
              <Text style={[styles.rowSubtitle, { color: colors.secondary }]}>Вибрировать при входящих сообщениях</Text>
            </View>
            <Switch
              value={settings.vibrateOnMessage}
              onValueChange={(val) => updateSetting("vibrateOnMessage", val)}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={settings.vibrateOnMessage ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Account Settings */}
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Аккаунт и конфиденциальность</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleResetIdentity}
            disabled={resetting}
          >
            <View>
              <Text style={[styles.dangerText, { color: colors.danger }]}>Сбросить личность</Text>
              <Text style={[styles.rowSubtitle, { color: colors.secondary }]}>
                Сгенерировать новый анонимный токен профиля
              </Text>
            </View>
            {resetting && <ActivityIndicator color={colors.danger} />}
          </TouchableOpacity>
        </View>

        {/* Links */}
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Информация</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push("/about")}
          >
            <Text style={[styles.linkRowText, { color: colors.primary }]}>О приложении</Text>
            <Text style={[styles.arrow, { color: colors.secondary }]}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 80,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  backButtonPlaceholder: {
    width: 80,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
    marginTop: spacing.md,
    letterSpacing: 0.8,
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  rowInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  divider: {
    borderBottomWidth: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  linkRowText: {
    fontSize: 16,
    fontWeight: "500",
  },
  arrow: {
    fontSize: 18,
    fontWeight: "600",
  },
});
