import { FormEvent, useContext, useState } from "react";
import { ColorContext } from "../lib/context/ColorContext";

export type ChatInputProps = {
    readOnly?: boolean;
}

export default function ChatInput (props: ChatInputProps) {
    const color = useContext(ColorContext);
    const [message, setMessage] = useState<string>();
    // function sendMessage(formData: FormData) {

    // }

    const numOfRows = (): number => Math.min((message || '').split('\n').length, 3);

    function handleInput(event: FormEvent<HTMLTextAreaElement>)
    {
        setMessage((event.target as HTMLTextAreaElement).value);
    }

    return (
        <section>
            <form className="w-full p-3 flex shadow-inner" action={''}>
                <textarea
                    readOnly={props.readOnly}
                    onInput={handleInput}
                    rows={numOfRows()}
                    className={`bg-${color}-500 text-white p-3 rounded-xl outline-none grow placeholder:text-neutral-100`}
                    placeholder="Desembuche..."
                    value={message}
                >
                </textarea>
            </form>
        </section>
    );
}
