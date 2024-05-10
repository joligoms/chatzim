import { FC } from "react";
import { cn } from "../lib/utils/cn";

export type Message = {
    id: string;
    username: string;
    direction: 'left'|'right';
    message: string;
    created_at?: string;
};

export type ChatBubbleProps = {
    username: string;
    displayUsername?: boolean;
    message: string;
    direction?: 'left' | 'right';
    color?: string;
};

const ChatBubble: FC<ChatBubbleProps> = ({
        username,
        message,
        direction = 'right',
        color = 'indigo',
        displayUsername = true,
    }) => {

    return (
        <div
            className={cn('w-full flex', {
                'justify-end': direction === 'right',
                'justify-start': direction === 'left',
            })}
        >
            <section
                dir={direction === 'right' ? 'rtl' : 'ltr'}
                className={cn(
                    'w-3/4',
                    'after:w-0', 'after:w-0', 'border-s-4'
                )}
            >
                {displayUsername ? <span>{username}</span> : null}
                <div dir="ltr" className={cn(`bg-${color}-500 text-white p-3 rounded-md whitespace-pre-wrap`)}>
                    {message}
                </div>
            </section>
        </div>
    );
}

export default ChatBubble;
