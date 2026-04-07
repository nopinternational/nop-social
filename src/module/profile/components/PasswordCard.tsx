/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ChangeEvent, useState } from "react";
import { Card } from "~/components/Card";

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
    const [visible, setVisible] = useState(false);

    const handleEyeToggle = () => {
        setVisible((v) => !v);
        setType((t) => (t === "password" ? "text" : "password"));
    };

    return (
        <div className="relative mb-4 w-full">
            <input
                className="w-full rounded-lg bg-white py-3 pl-3 pr-12 text-center text-black"
                name="password"
                type={type}
                value={passwordInputProps.value}
                onChange={passwordInputProps.onChange}
            />
            <button
                type="button"
                className="absolute inset-e-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-black hover:bg-black/5"
                onClick={handleEyeToggle}
                aria-label={visible ? "Dölj lösenord" : "Visa lösenord"}
            >
                {visible ? (
                    <svg width={25} height={25} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1={1} y1={1} x2={23} y2={23} />
                    </svg>
                ) : (
                    <svg width={25} height={25} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx={12} cy={12} r={3} />
                    </svg>
                )}
            </button>
        </div>
    );
};
