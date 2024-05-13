import { FormEvent, PropsWithChildren, useContext, useEffect, useState } from "react";
import { ColorContext } from "../lib/context/ColorContext";
import { useDebounce } from "../lib/hooks/useDebounce";

export type ChatInputProps = PropsWithChildren<{
    readOnly?: boolean;
    onSendMessage: (message: string) => void;
    onTyping: () => void;
    onStoppedTyping: () => void;
}>;

export default function ChatInput (props: ChatInputProps) {
    const [typing, setTyping] = useState(false);
    const color = useContext(ColorContext);
    const [message, setMessage] = useState<string | null>(null);
    // function sendMessage(formData: FormData) {

    // }

    const numOfRows = (): number => Math.min((message || '').split('\n').length, 3);

    const stopTyping = useDebounce(() => setTyping(false), 500);

    useEffect(() => {
        if (typing) props.onTyping(); else props.onStoppedTyping();
    }, [typing]);

    function handleInput(event: FormEvent<HTMLTextAreaElement>)
    {
        if (!typing) setTyping(true);
        stopTyping()
        setMessage((event.target as HTMLTextAreaElement).value);
    }

    function handleSendMessage() {
        const msg = message?.trim();
        if (!msg) return;
        props.onSendMessage(msg || '');
        setMessage(null);
    }

    return (
        <section className="shadow-inner w-full flex flex-col gap-2 p-3">
            {props.children}
            <form onSubmit={(e) => e.preventDefault()} className="w-full flex gap-2" action={''}>
                <textarea
                    readOnly={props.readOnly}
                    onInput={handleInput}
                    rows={numOfRows()}
                    className={`bg-${color}-500 text-white p-3 rounded-xl outline-none grow placeholder:text-neutral-100`}
                    placeholder="Desembuche..."
                    value={message || ''}
                >
                </textarea>
                <button onClick={handleSendMessage} disabled={props.readOnly} className={`bg-${color}-500 text-white p-3 rounded-xl outline-none`}>
                    enviar
                </button>
            </form>
        </section>
    );
}
