import { useEffect, useRef, useState } from "react";
import { createChatSocket } from "@/utils/websocket";
import type { WsEvent, SendMessageEvent, UserTypingEvent } from "@/types/websocket";
import { useSettings } from "@/hooks/useSettings";
import { Vibration } from "react-native";

export type Message = {
  type: "message" | "event";
  text: string;
  mine: boolean;
  authorAlias: string;
};

export function useChat(sessionId: string, token: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const { settings } = useSettings();
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const ws = createChatSocket(
      sessionId,
      token,
      (event: WsEvent) => {
        switch (event.event_type) {
          case "receive_message":
            if (settingsRef.current.vibrateOnMessage) {
              Vibration.vibrate(100);
            }
            setMessages((prev) => [
              ...prev,
              {
                type: "message",
                text: event.payload.message,
                mine: false,
                authorAlias: event.payload.alias,
              },
            ]);
            break;

          case "user_status": {
            const { alias, active_connections, status } = event.payload;
            setPeopleCount(active_connections);

            const actionText = status === "joined" ? "присоединился к чату" : "покинул чат";

            setMessages((prev) => [
              ...prev,
              {
                type: "event",
                text: `Пользователь ${alias} ${actionText}`,
                mine: false,
                authorAlias: "",
              },
            ]);
            break;
          }

          case "server_typing": {
            const { alias, typing } = event.payload;
            if (typing === "start") {
              setTypingUsers((prev) => {
                if (prev.includes(alias)) return prev;
                return [...prev, alias];
              });
            } else if (typing === "stop") {
              setTypingUsers((prev) => prev.filter((a) => a !== alias));
            }
            break;
          }

          case "error":
            setMessages((prev) => [
              ...prev,
              {
                type: "event",
                text: `Ошибка: ${event.payload.error_message}`,
                mine: false,
                authorAlias: "",
              },
            ]);
            break;

          case "send_message":
          case "user_typing":
            // Outgoing events, ignored if received
            break;

          default:
            const exhaustiveCheck: never = event;
            return exhaustiveCheck;
        }
      },
      () => setConnected(false),
    );

    ws.onopen = () => setConnected(true);

    wsRef.current = ws;

    return () => {
      ws.close();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [sessionId, token]);

  const onTyping = () => {
    if (!connected || !wsRef.current) return;

    if (!isTyping) {
      setIsTyping(true);
      const typingEvent: UserTypingEvent = {
        event_type: "user_typing",
        payload: { typing: "start" },
      };
      wsRef.current.send(JSON.stringify(typingEvent));
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const idleEvent: UserTypingEvent = {
          event_type: "user_typing",
          payload: { typing: "stop" },
        };
        wsRef.current.send(JSON.stringify(idleEvent));
      }
      setIsTyping(false);
    }, 2000);
  };

  function send(text: string) {
    if (!wsRef.current) {
      return;
    }

    const message: SendMessageEvent = {
      event_type: "send_message",
      payload: {
        message: text,
      },
    };

    wsRef.current.send(JSON.stringify(message));

    // Clear typing state immediately when message is sent
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (isTyping) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        const idleEvent: UserTypingEvent = {
          event_type: "user_typing",
          payload: { typing: "stop" },
        };
        wsRef.current.send(JSON.stringify(idleEvent));
      }
      setIsTyping(false);
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "message",
        text,
        mine: true,
        authorAlias: "You",
      },
    ]);
  }

  return {
    messages,
    connected,
    peopleCount,
    typingUsers,
    send,
    onTyping,
  };
}
