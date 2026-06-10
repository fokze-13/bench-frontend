export const BASE_URL = "127.0.0.1:8000"; // then change to VDS url

export const ENDPOINTS = {
    getToken: `${BASE_URL}/auth/get_token`,
    getSession: `${BASE_URL}/session/get_session`,
    ws: (sessionId: string, token: string) =>
        `wss://${BASE_URL}/session/connect/$?token=${token}session_id=${sessionId}`,
};
