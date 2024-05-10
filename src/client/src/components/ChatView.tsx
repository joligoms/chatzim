import { twMerge } from 'tailwind-merge';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';

export type ChatViewProps = PropsWithChildren<{
    className?: string|undefined;
}>;

const ChatView: FC<ChatViewProps> = (props) => {
    const bottomEl = useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => bottomEl.current?.scrollIntoView({ behavior: 'smooth'});

    useEffect(() => scrollToBottom(), [props.children]);

    return (
        <section className={twMerge('overflow-y-scroll flex flex-col gap-2 py-4', props.className)}>
            {props.children}
            <div className="invisible h-0" ref={bottomEl} />
        </section>
    )
}

export default ChatView;
