import { ChangeEvent, useEffect, useState } from "react";
import ChatInput from "./components/ChatInput"
import ChatView from "./components/ChatView"
import ChatBubble, { ChatMessage } from "./components/ChatBubble";
import UserForm, { UserData } from "./components/UserForm";
import { ColorContext } from "./lib/context/ColorContext";
import { ServerMessage, useSocket } from "./lib/hooks/useSocket";

function App() {
    const [typingUsers, setTypingUsers] = useState<Map<UserData['username'], UserData['selected-color']>>(new Map());
    const [chatHash, setChatHash] = useState<string|null>(null);
    const [user, setUser] = useState<UserData|null>(null);
    const [messages, setMessages] = useState<(ChatMessage|EventMessage)[]>([]);
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

    type TypingEvent = {
        type: 'user-typing';
        data: {
            isTyping: true;
            color: string;
            username: string;
        }
    }

    type EventMessage = {
        type: 'user-joined' | 'user-left';
        data: {
            username: string;
            color: string;
            at: UnixTimestamp;
        }
    }

    useEffect(() => {
        const lastMessage = socketMessages[socketMessages.length - 1] || null as ServerMessage | null;
        if (!lastMessage) return;

        switch (lastMessage?.type) {
            case 'handshake':
                setChatHash((lastMessage as Handshake).data.hash || null);
                break;
            case 'user-joined':
                setMessages(prevMessages => [...prevMessages, (lastMessage as EventMessage)])
                break;
            case 'user-left':
                setMessages(prevMessages => [...prevMessages, (lastMessage as EventMessage)])
                break;
            case 'user-typing':
                handleTyping(lastMessage as TypingEvent);
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
                    } satisfies ChatMessage;

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

    function handleTyping(typingEvent: TypingEvent) {
        const { data }= typingEvent;
        if (data.isTyping) {
            setTypingUsers(prevUsers => new Map(prevUsers.set(data.username, data.color)))
            return;
        }

        setTypingUsers(prevUsers => {
            const deleted = prevUsers.delete(data.username);
            if (!deleted) return prevUsers;
            return new Map(prevUsers);
        });
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

    function sendTypingStatus(isTyping: boolean)
    {
        if (!chatHash) return;
        if (!user) return;

        sendMessage('send-typing', { isTyping }, chatHash);
    }

    function getTypingComponent(users: typeof typingUsers): JSX.Element|null {
        if (users.size < 1) return null;


        if (users.size === 1) {
            const username = [...typingUsers.keys()][0];
            return <p className={`text-${users.get(username)}-500`}>{username} está pensando...</p>
        }

        const usersArr = [...users.keys()];

        return (
            <p>
                {usersArr.map((username, index) => {
                    const len = usersArr.length;
                    const prefix = len < 4 && index === (len - 1) ? 'e ' : null;
                    const suffix = index === (len - 1) ? '...' : ', ';

                    return <>
                    {prefix}<span className={`text-${typingUsers.get(username)}-500`}>{username}</span>{suffix}
                    </>
                })}
            </p>
        )
    }

    return (
        <main className="container h-[100dvh] flex flex-col">
            <ColorContext.Provider value={color}>
                <ChatView className="grow">
                    {chatHash
                        ? messages.map((msg, index) => {
                            if ('type' in msg) {
                                console.log(msg);
                                return (
                                    <div
                                        className="event flex items-center gap-2"
                                        key={`${msg.data.username}_joined_${msg.data.at}`}
                                    >
                                        <hr className={`grow border-none h-[1px] text-${msg.data.color}-500 bg-${msg.data.color}-500`} />
                                        <span className={`text-${msg.data.color}-600`}>
                                            {msg.type === 'user-joined'
                                                ? msg.data.username.trim() + ' tá on!!!'
                                                : msg.data.username.trim() + ' tá off :(((('
                                            }
                                        </span>
                                        <hr className={`grow border-none h-[1px] text-${msg.data.color}-500 bg-${msg.data.color}-500`} />
                                    </div>
                                );
                            }

                            const prevMsg: ChatMessage|EventMessage|null = messages[index - 1] || null;
                            const displayUsername = (prevMsg?.type !== undefined) && prevMsg?.username !== msg.username;

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
                <ChatInput onTyping={() => sendTypingStatus(true)} onStoppedTyping={() => sendTypingStatus(false)} onSendMessage={handleSendMessage} readOnly={!chatHash}>
                    <div className="h-5">
                        {getTypingComponent(typingUsers)}
                    </div>
                </ChatInput>
            </ColorContext.Provider>
        </main>
    )
}

export default App
