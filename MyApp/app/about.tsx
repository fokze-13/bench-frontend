import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSettings } from "@/hooks/useSettings";
import { spacing, radius } from "@/styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const { colors } = useSettings();

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.error("Couldn't open link", err);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.accent }]}>← Назад</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>О приложении</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo and Description */}
        <View style={styles.logoSection}>
          <View style={[styles.logoContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.bubbleLeft, { backgroundColor: colors.accent }]} />
            <View style={[styles.bubbleRight, { backgroundColor: colors.accentSoft }]} />
            <Text style={styles.logoText}>B</Text>
          </View>
          <Text style={[styles.appName, { color: colors.primary }]}>Bench</Text>
          <Text style={[styles.appVersion, { color: colors.secondary }]}>Версия 1.0.0</Text>
          <Text style={[styles.appDescription, { color: colors.secondary }]}>
            Анонимные групповые чаты для быстрого и конфиденциального общения без лишних следов.
          </Text>
        </View>

        {/* Features */}
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Ключевые преимущества</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.featureRow, styles.divider, { borderBottomColor: colors.border }]}>
            <Text style={styles.featureIcon}>🕶️</Text>
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: colors.primary }]}>Полная анонимность</Text>
              <Text style={[styles.featureDesc, { color: colors.secondary }]}>
                Никаких личных данных, номеров телефонов или электронной почты. Только случайные псевдонимы.
              </Text>
            </View>
          </View>

          <View style={[styles.featureRow, styles.divider, { borderBottomColor: colors.border }]}>
            <Text style={styles.featureIcon}>🎲</Text>
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: colors.primary }]}>Случайный подбор комнат</Text>
              <Text style={[styles.featureDesc, { color: colors.secondary }]}>
                Мгновенное подключение к доступным комнатам для общения с другими пользователями.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🧹</Text>
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: colors.primary }]}>Никакой истории чатов</Text>
              <Text style={[styles.featureDesc, { color: colors.secondary }]}>
                Все сообщения сохраняются только в оперативной памяти сервера и удаляются при закрытии комнаты.
              </Text>
            </View>
          </View>
        </View>

        {/* Contacts */}
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Контакты разработчика</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.contactRow, styles.divider, { borderBottomColor: colors.border }]}
            onPress={() => handleOpenLink("https://t.me/hudp72")}
          >
            <View style={styles.contactLeft}>
              <Text style={styles.contactIcon}>✈️</Text>
              <Text style={[styles.contactTitle, { color: colors.primary }]}>Telegram</Text>
            </View>
            <Text style={[styles.contactValue, { color: colors.accent }]}>@hudp72</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => handleOpenLink("https://github.com/fokze-13")}
          >
            <View style={styles.contactLeft}>
              <Text style={styles.contactIcon}>🐙</Text>
              <Text style={[styles.contactTitle, { color: colors.primary }]}>GitHub</Text>
            </View>
            <Text style={[styles.contactValue, { color: colors.accent }]}>fokze-13</Text>
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
  logoSection: {
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bubbleLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: "absolute",
    top: 20,
    left: 15,
    opacity: 0.8,
  },
  bubbleRight: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: "absolute",
    bottom: 18,
    right: 12,
    opacity: 0.7,
  },
  logoText: {
    fontSize: 38,
    fontWeight: "900",
    color: "#FFFFFF",
    zIndex: 1,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: spacing.sm,
  },
  appVersion: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: "500",
  },
  appDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
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
  featureRow: {
    flexDirection: "row",
    padding: spacing.md,
    alignItems: "flex-start",
  },
  featureIcon: {
    fontSize: 22,
    marginRight: spacing.md,
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    borderBottomWidth: 1,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  contactLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  contactValue: {
    fontSize: 15,
    fontWeight: "600",
  },
});
