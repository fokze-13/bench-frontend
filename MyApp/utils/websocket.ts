import { ENDPOINTS } from "@/constants/api";
import type { WsEvent } from "@/types/websocket";

export function createChatSocket(
    sessionId: string,
    token: string,
    onMessage: (event: WsEvent) => void,
    onClose: () => void,
): WebSocket {
    const ws = new WebSocket(ENDPOINTS.ws(sessionId, token));

    ws.onmessage = (e: MessageEvent<string>) => {
        try {
            const event: WsEvent = JSON.parse(e.data);

            onMessage(event);
        } catch (err) {
            console.error("Failed to parse WS message:", err);
        }
    };

    ws.onclose = onClose;
    ws.onerror = (e) => console.error("WS error", e);

    return ws;
}
