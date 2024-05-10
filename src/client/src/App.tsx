import { ChangeEvent, useEffect, useState } from "react";
import ChatInput from "./components/ChatInput"
import ChatView from "./components/ChatView"
import ChatBubble, { Message } from "./components/ChatBubble";
import UserForm from "./components/UserForm";
import { ColorContext } from "./lib/context/ColorContext";

function App() {
    const [chatStarted, setChatStarted] = useState(false);
    const [color, setColor] = useState('indigo');

    useEffect(() => {
        if (chatStarted) {
            console.log('started');
        }

    }, [chatStarted]);

    function handleColorChange(e: ChangeEvent<HTMLInputElement>) {
        setColor(e.target.value);
    }

    const messages: Message[] = [
        {id: 'oqwdji', username: 'joaozim', direction: 'right', message: 'Olá pai, tudo bem?'},
        {id: 'fqpwoeqe', username: 'paizim', direction: 'left', message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae earum, provident accusamus voluptas quo officiis harum dignissimos, libero quasi laboriosam, fugiat cupiditate nemo omnis distinctio sapiente ex! Beatae unde dicta, soluta eveniet placeat nesciunt! Provident nobis laudantium eum similique culpa? Autem officiis laudantium in! Inventore enim deserunt eligendi dolore quis!"},
        {id: 'hdiwhiwhd', username: 'joaozim', direction: 'right', message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae earum, provident accusamus voluptas quo officiis harum dignissimos, libero quasi laboriosam, fugiat cupiditate nemo omnis distinctio sapiente ex! Beatae unde dicta, soluta eveniet placeat nesciunt! Provident nobis laudantium eum similique culpa? Autem officiis laudantium in! Inventore enim deserunt eligendi dolore quis!"},
        {id: 'hihihihehe', username: 'joaozim', direction: 'right', message: "Hohohohoho"},
        {id: 'hihihihasdehe', username: 'joaozim', direction: 'right', message: "HohohohohoHahahadoiejjoijf"},
        {id: 'cmcomeomcw', username: 'paizim', direction: 'left', message: "Sim!"},
    ];

    return (
        <main className="container h-[100dvh] flex flex-col">
            <ColorContext.Provider value={color}>
                <ChatView className="grow">
                    {chatStarted
                        ? messages.map((msg, index) => {
                            const prevMsg: Message|null = messages[index - 1] || null;
                            const displayUsername = prevMsg?.username !== msg.username;

                            return <ChatBubble
                                key={msg.id}
                                message={msg.message}
                                username={msg.username}
                                direction={msg.direction}
                                displayUsername={displayUsername}
                            />
                        })
                        : <UserForm onColorChange={handleColorChange} />
                    }
                </ChatView>
                <ChatInput readOnly={!chatStarted} />
            </ColorContext.Provider>
        </main>
    )
}

export default App
