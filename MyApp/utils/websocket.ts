import { ENDPOINTS } from "@/constants/api";

export function createChatSocket(
    sessionId: string,
    token: string,
    onMessage: (text: string) => void,
    onClose: () => void,
): WebSocket {
    const ws = new WebSocket(ENDPOINTS.ws(sessionId, token));

    ws.onmessage = (e) => onMessage(e.data);
    ws.onclose = onClose;
    ws.onerror = (e) => console.error("WS error", e);

    return ws;
}
