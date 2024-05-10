import { ChangeEvent, FC } from "react";
import { cn } from "../lib/utils/cn";

export type ColorSelectProps = {
    color: string;
    className?: string;
    selected?: boolean;
    onSelected?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const ColorSelect: FC<ColorSelectProps> = ({color, className = '', selected = false, ...props}) => {
    return (
        <input
            type="radio"
            id={color}
            value={color}
            name="selected-color"
            onChange={props.onSelected}
            checked={selected}
            className={cn(
                'appearance-none bg-indigo-500 rounded-lg w-16 h-16', className,
                { 'outline outline-2 outline-slate-800': selected }
            )}
        />
    );
};

export default ColorSelect;
