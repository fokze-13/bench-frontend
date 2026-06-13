export type UserStatus = "joined" | "left";
export type TypingStatus = "start" | "stop";

export type SendMessagePayload = {
  message: string;
};

export type ReceiveMessagePayload = {
  message: string;
  alias: string;
};

export type UserStatusPayload = {
  alias: string;
  active_connections: number;
  status: UserStatus;
};

export type UserTypingPayload = {
  typing: TypingStatus;
};

export type ServerTypingPayload = {
  typing: TypingStatus;
  alias: string;
};

export type ErrorPayload = {
  error_message: string;
};

export type SendMessageEvent = {
  event_type: "send_message";
  payload: SendMessagePayload;
};

export type ReceiveMessageEvent = {
  event_type: "receive_message";
  payload: ReceiveMessagePayload;
};

export type UserStatusEvent = {
  event_type: "user_status";
  payload: UserStatusPayload;
};

export type UserTypingEvent = {
  event_type: "user_typing";
  payload: UserTypingPayload;
};

export type ServerTypingEvent = {
  event_type: "server_typing";
  payload: ServerTypingPayload;
};

export type ErrorEvent = {
  event_type: "error";
  payload: ErrorPayload;
};

export type WebSocketEvent =
  | SendMessageEvent
  | ReceiveMessageEvent
  | UserStatusEvent
  | ServerTypingEvent
  | UserTypingEvent
  | ErrorEvent;

export type WsEvent = WebSocketEvent;
