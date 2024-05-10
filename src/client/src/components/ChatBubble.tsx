import { FC } from "react";
import { cn } from "../lib/utils/cn";

export type Message = {
    username: string;
    message: string;
    color: string;
    direction: 'left'|'right';
    sent_at: Date;
};

export type ChatBubbleProps = {
    username: string;
    message: string;
    direction?: 'left' | 'right';
    displayUsername?: boolean;
    color?: string;
    sent_at: Date;
};

const ChatBubble: FC<ChatBubbleProps> = ({
        username,
        message,
        sent_at,
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
                    <div>
                        {message}
                    </div>
                    <div dir="rtl" className="w-full">{sent_at.toLocaleTimeString()}</div>
                </div>
            </section>
        </div>
    );
}

export default ChatBubble;
