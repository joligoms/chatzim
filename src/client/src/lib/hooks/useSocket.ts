import { useRef, useState } from "react";

export type ServerMessageData = string|object|boolean|[];

export type ServerMessage = {
    type: string;
    data: Record<string, ServerMessageData>;
};

export function useSocket(url: string) {
    const ws = useRef<WebSocket|null>(null);
    const [messages, setMessages] = useState<ServerMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    // useEffect(() => {
    //     return () => {
    //         ws?.current?.close();
    //     }
    // }, [url]);

    function sendMessage(type: string, data: ServerMessage['data'], hash: string) {
        if (!websocketAvailable(ws)) return;

        ws?.current?.send(JSON.stringify({ type, hash, data }));
    }

    function connectSocket(data: Record<string, string>) {
        ws.current = new WebSocket(url + '?' + new URLSearchParams(data));
        ws.current.onopen = () => setIsConnected(true);
        ws.current.onmessage = event => {
            const message = JSON.parse(event.data) as ServerMessage;
            setMessages((prevMessages) => [...prevMessages, message])
        }
        ws.current.onclose = () => setIsConnected(false);
    }

    function closeSocket() {
        if (!websocketAvailable(ws)) return;

        ws?.current?.close();
        setIsConnected(false);
    }

    function websocketAvailable(socket: typeof ws) {
        return Boolean(socket.current) && socket?.current?.readyState === WebSocket.OPEN;
    }

    return {isConnected, messages, sendMessage, connectSocket, closeSocket};
}
