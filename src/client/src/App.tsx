import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ChatInput from "./components/ChatInput"
import ChatView from "./components/ChatView"
import ChatBubble, { Message } from "./components/ChatBubble";
import UserForm from "./components/UserForm";
import { ColorContext } from "./lib/context/ColorContext";
import { ServerMessage, useSocket } from "./lib/hooks/useSocket";

function App() {
    const [isChatStarted, setIsChatStarted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const {messages: socketMessages, sendMessage, isConnected, connectSocket}= useSocket(`ws://${location.host}/ws`);
    const [color, setColor] = useState('indigo');

    type UnixTimestamp = number;

    type RecievedMessage = ServerMessage & {
        type: 'chat-message';
        data: {
            username: string;
            text: string;
            sent_at: UnixTimestamp;
            color: string;
        };
    };

    useEffect(() => {
        if (isConnected) setIsChatStarted(true);
    }, [isConnected]);

    useEffect(() => {
        const lastMessage = socketMessages[socketMessages.length - 1] || null as ServerMessage | null;
        if (!lastMessage) return;

        switch (lastMessage?.type) {
            case 'user-joined':
                console.log('entrou o ' + lastMessage?.data?.username);
                break;
            case 'user-left':
                console.log('saiu o ' + lastMessage?.data?.username);
                break;
            case 'recieved-message':
                setMessages((prevMessages) => {
                    const {data} = (lastMessage as RecievedMessage);
                    const newMessage = {
                        username: data.username,
                        message: data.text,
                        color: data.color,
                        direction: 'left',
                        sent_at: (new Date(data.sent_at)),
                    } satisfies Message;
                    console.log(newMessage);

                    return [...prevMessages, newMessage];
                });
                break;
            default:
                break;
        }

    }, [socketMessages]);

    function enterChat(e: FormEvent<HTMLFormElement>) {
        const userData = Object.fromEntries(new FormData(e.target as HTMLFormElement));
        connectSocket(userData);
    }

    function handleColorChange(e: ChangeEvent<HTMLInputElement>) {
        setColor(e.target.value);
    }

    return (
        <main className="container h-[100dvh] flex flex-col">
            <ColorContext.Provider value={color}>
                <ChatView className="grow">
                    {isChatStarted
                        ? messages.map((msg, index) => {
                            const prevMsg: Message|null = messages[index - 1] || null;
                            const displayUsername = prevMsg?.username !== msg.username;

                            return <ChatBubble
                                key={msg.sent_at.getTime()}
                                sent_at={msg.sent_at}
                                message={msg.message}
                                color={msg.color}
                                username={msg.username}
                                direction={msg.direction}
                                displayUsername={displayUsername}
                            />
                        })
                        : <UserForm onEnterChat={enterChat} onColorChange={handleColorChange} />
                    }
                </ChatView>
                <ChatInput readOnly={!isChatStarted} />
            </ColorContext.Provider>
        </main>
    )
}

export default App
