import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import ColorSelect from "./ColorSelect";
import { ColorContext } from "../lib/context/ColorContext";
import { colorOptions } from "../lib/data/colors";

export type UserData = {
    username: string;
    'selected-color': string;
}

export type UserFormProps = {
    onColorChange: (e: ChangeEvent<HTMLInputElement>) => void
    onEnterChat: (user: UserData) => void
}

const UserForm: FC<UserFormProps> = ({onColorChange, onEnterChat}) => {
    const color = useContext(ColorContext);
    const [usersOnline, setUsersOnline] = useState<number>(0);

    useEffect(() => {
        try {
            fetch('http://' + location.host + '/api/online-users')
                .then(res => res.json())
                .then(data => setUsersOnline(data.count));
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <section className="drop-shadow-sm bg-slate-200 p-5 self-center justify-self-center w-5/6 rounded-lg">
            <section className="p-3">
                <h1 className={`text-${color}-700 font-bold text-3xl text-center w-full`}>Chatzim</h1>
                <h2 className={`text-${color}-600 text-center mx-auto`}>{usersOnline > 0 ? `${usersOnline} pessoa${usersOnline > 1 ? 's' : ''} online` : 'ninguém online :('}</h2>
            </section>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const userData = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as UserData;
                    onEnterChat(userData);
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
                    {Array.from(colorOptions).map(colorOption => (
                        <ColorSelect key={colorOption} onSelected={onColorChange} color={colorOption} className={`bg-${colorOption}-500`} selected={color === colorOption} />
                    ))}
                </section>

                <button type="submit" className={`bg-${color}-500 text-white py-2 px-4 mx-auto rounded-lg`}>entrar</button>
            </form>
        </section>
    );
}

export default UserForm;
