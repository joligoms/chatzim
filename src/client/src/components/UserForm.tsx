import { ChangeEvent, FC, FormEvent, useContext } from "react";
import ColorSelect from "./ColorSelect";
import { ColorContext } from "../lib/context/ColorContext";

export type UserFormProps = {
    onColorChange: (e: ChangeEvent<HTMLInputElement>) => void
    onEnterChat: (e: FormEvent<HTMLFormElement>) => void
}

const UserForm: FC<UserFormProps> = ({onColorChange, onEnterChat}) => {
    const color = useContext(ColorContext);
    const usersOnline = 0;

    return (
        <section className="drop-shadow-sm bg-slate-200 p-5 self-center justify-self-center w-5/6 rounded-lg">
            <section className="p-3">
                <h1 className={`text-indigo-500 font-bold text-3xl text-center w-full`}>Chatzim</h1>
                <h2 className="text-center mx-auto">{usersOnline > 0 ? `${usersOnline} pessoas online` : 'ninguém online :('}</h2>
            </section>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onEnterChat(e)
                }}
                className="flex flex-col gap-4"
            >
                {/* <label htmlFor="username">usuário:</label> */}
                <input
                    className={`text-white bg-${color}-500 outline-none placeholder:text-neutral-100 p-2 text-center`}
                    type="text"
                    id="username"
                    name="username"
                    placeholder="nome do usuário"
                />

                {/* <label htmlFor="username">cores maneiras:</label> */}
                <section className="grid grid-cols-3 gap-3 items-center justify-items-center">
                    <ColorSelect onSelected={onColorChange} color="indigo" className="bg-indigo-500" selected={color === 'indigo'} />
                    <ColorSelect onSelected={onColorChange} color="red" className="bg-red-500" selected={color === 'red'} />
                    <ColorSelect onSelected={onColorChange} color="yellow" className="bg-yellow-500" selected={color === 'yellow'} />
                    <ColorSelect onSelected={onColorChange} color="green" className="bg-green-500" selected={color === 'green'} />
                    <ColorSelect onSelected={onColorChange} color="amber" className="bg-amber-500" selected={color === 'amber'} />
                    <ColorSelect onSelected={onColorChange} color="cyan" className="bg-cyan-500" selected={color === 'cyan'} />
                </section>

                <button type="submit" className={`bg-${color}-500 text-white py-2 px-4 mx-auto rounded-lg`}>entrar</button>
            </form>
        </section>
    );
}

export default UserForm;
