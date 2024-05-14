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

  const onChangePass = (e: ChangeEvent<HTMLInputElement>) => {
    const k = e.target.name as keyof PasswordState;
    const v = e.target.value || "";
    const newState: PasswordState = { ...getPass };
    newState[k] = v;
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
        <input
          className="w-full rounded-lg px-3 py-3 text-center text-black"
          name="password1"
          type="password"
          value={getPass["password1"]}
          onChange={onChangePass}
        ></input>
        <br />
        <div className="m-2">Repetera lösenordet</div>
        <input
          className="w-full rounded-lg px-3 py-3 text-center text-black"
          name="password2"
          type="password"
          value={getPass["password2"]}
          onChange={onChangePass}
        ></input>
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
