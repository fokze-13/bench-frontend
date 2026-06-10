export type WsEvent =
    | {
          type: "send_message";
          payload: {
              message: string;
              author_alias: string;
          };
      }
    | {
          type: "event";
          payload: {
              event_message: string;
          };
      };

export type SendMessageCommand = {
    type: "receive_message";
    payload: {
        message: string;
    };
};
