import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useChat, Message } from "@/hooks/useChat";
import { useSettings } from "@/hooks/useSettings";
import { spacing, radius } from "@/styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";

// Deterministic HSL color generator for peers
function getPeerColor(alias: string, isDark: boolean): string {
  if (!alias || alias === "You") return isDark ? "#4DA3FF" : "#007AFF";
  let hash = 0;
  for (let i = 0; i < alias.length; i++) {
    hash = alias.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  const saturation = 75; // rich colors
  const lightness = isDark ? 65 : 40; // readable on dark/light backgrounds
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default function ChatScreen() {
  const { sessionId, token } = useLocalSearchParams<{ sessionId: string; token: string }>();
  const { settings, colors, isDark } = useSettings();
  
  // Custom hook usage
  const { messages, connected, peopleCount, typingUsers, send, onTyping } = useChat(sessionId || "", token || "");
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll list when message count changes
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    send(trimmed);
    setInputText("");
  };

  const handleLeaveRoom = () => {
    Alert.alert(
      "Выйти из комнаты",
      "Вы действительно хотите покинуть эту комнату?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Выйти",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Message }) => {
    if (item.type === "event") {
      return (
        <View style={styles.eventContainer}>
          <View style={[styles.eventBadge, { backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }]}>
            <Text style={[styles.eventText, { color: colors.secondary }]}>
              📢 {item.text}
            </Text>
          </View>
        </View>
      );
    }

    const isMine = item.mine;
    const peerColor = getPeerColor(item.authorAlias, isDark);

    return (
      <View style={[styles.messageWrapper, isMine ? styles.myWrapper : styles.peerWrapper]}>
        {!isMine && (
          <Text style={[styles.aliasText, { color: peerColor }]}>
            {item.authorAlias}
          </Text>
        )}
        <View
          style={[
            styles.bubble,
            isMine
              ? [styles.myBubble, { backgroundColor: colors.accent }]
              : [styles.peerBubble, { backgroundColor: colors.surface, borderColor: colors.border }],
          ]}
        >
          <Text style={[styles.messageText, { color: isMine ? "#FFFFFF" : colors.primary }]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
          <View style={styles.headerInfo}>
            <Text style={[styles.roomTitle, { color: colors.primary }]}>
              Комната #{sessionId ? sessionId.substring(0, 8) : "..."}
            </Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusIndicator, { backgroundColor: connected ? "#4CAF50" : colors.danger }]} />
              <Text style={[styles.statusText, { color: colors.secondary }]}>
                {connected ? `${peopleCount} участников онлайн` : "Отключено"}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLeaveRoom} style={[styles.leaveButton, { borderColor: colors.danger }]}>
            <Text style={[styles.leaveText, { color: colors.danger }]}>Выйти</Text>
          </TouchableOpacity>
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <View style={[styles.typingContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            <Text style={[styles.typingText, { color: colors.secondary }]}>
              💬 {typingUsers.join(", ")} {typingUsers.length === 1 ? "печатает..." : "печатают..."}
            </Text>
          </View>
        )}

        {/* Footer / Input */}
        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.bg,
                color: colors.primary,
                borderColor: colors.border,
              },
            ]}
            placeholder="Напишите сообщение..."
            placeholderTextColor={colors.secondary}
            value={inputText}
            onChangeText={(text) => {
              setInputText(text);
              onTyping();
            }}
            multiline={false}
            onSubmitEditing={settings.sendOnEnter ? handleSend : undefined}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendButton, { backgroundColor: colors.accent }, !inputText.trim() && styles.sendButtonDisabled]}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Отправить</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  headerInfo: {
    flex: 1,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  leaveButton: {
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  leaveText: {
    fontSize: 14,
    fontWeight: "600",
  },
  messageList: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  messageWrapper: {
    marginBottom: spacing.md,
    maxWidth: "80%",
  },
  myWrapper: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  peerWrapper: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  aliasText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  myBubble: {
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  peerBubble: {
    borderWidth: 1,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: radius.md,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  eventContainer: {
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  eventBadge: {
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
  },
  eventText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    padding: spacing.sm,
    alignItems: "center",
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    marginRight: spacing.sm,
  },
  sendButton: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  typingContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
  },
  typingText: {
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "500",
  },
});
