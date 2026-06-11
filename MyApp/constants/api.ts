export const BASE_URL = "http://192.168.1.196"; // then change to VDS url

export const ENDPOINTS = {
    getToken: `${BASE_URL}/auth/get_token`,
    getSession: `${BASE_URL}/session/get_session`,
    ws: (sessionId: string, token: string) =>
        `ws://${BASE_URL}/session/connect/$?token=${token}session_id=${sessionId}`,
};
