import { ChangeEvent, useEffect, useState } from "react";
import ChatInput from "./components/ChatInput"
import ChatView from "./components/ChatView"
import ChatBubble, { Message } from "./components/ChatBubble";
import UserForm, { UserData } from "./components/UserForm";
import { ColorContext } from "./lib/context/ColorContext";
import { ServerMessage, useSocket } from "./lib/hooks/useSocket";

function App() {
    const [chatHash, setChatHash] = useState<string|null>(null);
    const [user, setUser] = useState<UserData|null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const {messages: socketMessages, sendMessage, connectSocket}= useSocket(`ws://${location.host}/ws`);
    const [color, setColor] = useState('indigo');

    type UnixTimestamp = number;

    type Handshake = ServerMessage & {
        type: 'handshake';
        data: {hash: string}
    };

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
        const lastMessage = socketMessages[socketMessages.length - 1] || null as ServerMessage | null;
        console.log(lastMessage);
        if (!lastMessage) return;

        switch (lastMessage?.type) {
            case 'handshake':
                setChatHash((lastMessage as Handshake).data.hash || null);
                break;
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

                    return [...prevMessages, newMessage];
                });
                break;
            default:
                break;
        }

    }, [socketMessages]);

    function enterChat(user: UserData) {
        setUser(user);
        connectSocket(user);
    }

    function handleSendMessage(text: string) {
        if (!chatHash) throw new Error('No hash was provided.');
        if (!user) throw new Error('No current user was found.');
        sendMessage('send-message', { text: text }, chatHash);
        setMessages(prevMessages => {
            return [...prevMessages, {
                username: user.username,
                message: text,
                color: user['selected-color'],
                direction: 'right',
                sent_at: (new Date()),
            }];
        });
    }

    function handleColorChange(e: ChangeEvent<HTMLInputElement>) {
        setColor(e.target.value);
    }

    return (
        <main className="container h-[100dvh] flex flex-col">
            <ColorContext.Provider value={color}>
                <ChatView className="grow">
                    {chatHash
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
                <ChatInput onSendMessage={handleSendMessage} readOnly={!chatHash} />
            </ColorContext.Provider>
        </main>
    )
}

export default App
