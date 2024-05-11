import { FormEvent, useContext, useState } from "react";
import { ColorContext } from "../lib/context/ColorContext";

export type ChatInputProps = {
    readOnly?: boolean;
    onSendMessage: (message: string) => void
}

export default function ChatInput (props: ChatInputProps) {
    const color = useContext(ColorContext);
    const [message, setMessage] = useState<string | null>(null);
    // function sendMessage(formData: FormData) {

    // }

    const numOfRows = (): number => Math.min((message || '').split('\n').length, 3);

    function handleInput(event: FormEvent<HTMLTextAreaElement>)
    {
        setMessage((event.target as HTMLTextAreaElement).value);
    }

    function handleSendMessage() {
        const msg = message?.trim();
        if (!msg) return;
        props.onSendMessage(msg || '');
        setMessage(null);
    }

    return (
        <section>
            <form onSubmit={(e) => e.preventDefault()} className="w-full p-3 flex shadow-inner gap-2" action={''}>
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
