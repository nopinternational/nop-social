/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ChangeEvent, useState } from "react";
import { Card } from "~/components/Card";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

type PasswordCardProps = {
  onPasswordChange?: (password: string) => void;
};

type PasswordState = {
  password1: string;
  password2: string;
};

export const PasswordCard = ({ onPasswordChange }: PasswordCardProps) => {
    const [getPass, setPass] = useState<PasswordState>({
        password1: "",
        password2: "",
    });
    const [errorText, setErrorText] = useState<string | null>(null);

    const onChangePass = (name: string, e: ChangeEvent<HTMLInputElement>) => {
    // const k = e.target.name as keyof PasswordState;
        const v = e.target.value || "";
        const newState: PasswordState = { ...getPass };
        newState[name as keyof PasswordState] = v;
        setPass(newState);
    };

    const submitFormClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ): void => {
        event.preventDefault();
        const p1 = getPass["password1"];
        const p2 = getPass["password2"];

        if (p1 === "" || p1.length < 6) {
            setErrorText("Lösenordet kan inte var tomt eller kortare än 6 tecken");
            return;
        }
        const passwordMatches = p1 === p2 && p1 != "";

        if (passwordMatches) {
            onPasswordChange && onPasswordChange(p1);
        } else {
            setErrorText("Lösenorden matchar inte");
        }
    };
    return (
        <Card header="Ange nytt lösenord">
            <div className="text-lg">
        Här kan ni ange nytt lösenord. Efter att ni har angett nytt lösenord kan
        ni använda det för att logga in
            </div>
            <form className="p-2">
                <div className="m-2">Lösenord</div>
                <PasswordInput
                    value={getPass["password1"]}
                    onChange={(e) => onChangePass("password1", e)}
                />
                <br />
                <div className="m-2">Repetera lösenordet</div>
                <PasswordInput
                    value={getPass["password2"]}
                    onChange={(e) => onChangePass("password2", e)}
                />

                <br />
                {errorText ? <p>{errorText}</p> : null}

                <br />
                <button
                    className="mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                        submitFormClick(event)
                    }
                >
          Återställ lösenord
                </button>
            </form>
        </Card>
    );
};

type PasswordInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const PasswordInput = (passwordInputProps: PasswordInputProps) => {
    const [type, setType] = useState("password");
    const [icon, setIcon] = useState(eyeOff);

    const handleEyeToggle = () => {
        if (type === "password") {
            setIcon(eye);
            setType("text");
        } else {
            setIcon(eyeOff);
            setType("password");
        }
    };
    return (
        <div className="mb-4 flex">
            <input
                className="w-full rounded-lg px-3 py-3 text-center text-black"
                name="password"
                type={type}
                value={passwordInputProps.value}
                onChange={passwordInputProps.onChange}
            />
            <span
                className="flex items-center justify-around text-black"
                onClick={handleEyeToggle}
            >
                <Icon className="absolute mr-10" icon={icon} size={25} />
            </span>
        </div>
    );
};
