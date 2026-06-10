export type sendMessage = {
    type: "receive_message";
    payload: {
        message: string;
    };
};

export type receiveMessage = {
    type: "send_message";
    payload: {
        message: string;
        author_alias: string;
    }
}

export type ServerMessage = {
    type: string;
    payload: object;
}