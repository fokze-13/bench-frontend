import { useEffect, useRef, useState } from "react";
import { createChatSocket } from "@/utils/websocket";
import type { WsEvent, SendMessageCommand } from "@/types/websocket";

export type Message = {
    type: "message" | "event";
    text: string;
    mine: boolean;
    authorAlias: string;
};

export function useChat(sessionId: string, token: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [connected, setConnected] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = createChatSocket(
            sessionId,
            token,
            (event: WsEvent) => {
                switch (event.type) {
                    case "send_message":
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

                    case "event":
                        setMessages((prev) => [
                            ...prev,
                            {
                                type: "event",
                                text: event.payload.event_message,
                                mine: false,
                                authorAlias: "",
                            },
                        ]);
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
        send,
    };
}
