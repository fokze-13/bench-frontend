import { useEffect, useRef, useState } from "react";
import { createChatSocket } from "@/utils/websocket";
import type { WsEvent, SendMessageCommand } from "@/types/websocket";
import { useSettings } from "@/hooks/useSettings";
import { Vibration } from "react-native";

export type Message = {
  type: "message" | "event";
  text: string;
  mine: boolean;
  authorAlias: string;
};

function parsePeopleCountChange(msgText: string): number {
  const text = msgText.toLowerCase();
  
  // Try to find explicit numbers first: e.g. "people: 3", "users online: 5", "4 users in room"
  const numMatch = text.match(/(\d+)\s*(people|users|members|participants|пользователей|участников|человек)/);
  if (numMatch) {
    const val = parseInt(numMatch[1], 10);
    if (!isNaN(val)) return val;
  }
  
  if (text.includes("joined") || text.includes("entered") || text.includes("присоединился") || text.includes("подключился") || text.includes("вошел")) {
    return 1;
  }
  if (text.includes("left") || text.includes("disconnected") || text.includes("вышел") || text.includes("отключился")) {
    return -1;
  }
  return 0;
}

export function useChat(sessionId: string, token: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);
  const { settings } = useSettings();

  const wsRef = useRef<WebSocket | null>(null);
  
  // Maintain a reference to settings so we don't recreate the socket connection when options toggle
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const ws = createChatSocket(
      sessionId,
      token,
      (event: WsEvent) => {
        switch (event.type) {
          case "send_message":
            if (settingsRef.current.vibrateOnMessage) {
              Vibration.vibrate(100);
            }
            setMessages((prev) => [
              ...prev,
              {
                type: "message",
                text: event.payload.message,
                mine: false,
                authorAlias: event.payload.author_alias,
              },
            ]);
            break;

          case "event": {
            const eventMsg = event.payload.event_message;
            setMessages((prev) => [
              ...prev,
              {
                type: "event",
                text: eventMsg,
                mine: false,
                authorAlias: "",
              },
            ]);

            const change = parsePeopleCountChange(eventMsg);
            if (change > 5) {
              setPeopleCount(change);
            } else if (change === 1 || change === -1) {
              setPeopleCount((prev) => Math.max(1, prev + change));
            } else if (change > 0) {
              setPeopleCount(change);
            }
            break;
          }

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
    };
  }, [sessionId, token]);

  function send(text: string) {
    if (!wsRef.current) {
      return;
    }

    const message: SendMessageCommand = {
      type: "receive_message",
      payload: {
        message: text,
      },
    };

    wsRef.current.send(JSON.stringify(message));

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
    send,
  };
}

