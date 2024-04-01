import {
    type FC,
    type ReactNode,
    useState,
} from "react";

export interface TextEditFormOptions {
    buttontext?: string
    headingText?: string | ReactNode
    emptyOnSubmit?: boolean
}

export const TextEditForm: FC<{ placeholder?: string, value?: string, onsubmitHandler?: ({ text }: { text: string }) => void, options?: TextEditFormOptions }> = ({ placeholder, value, onsubmitHandler, options }) => {
    const [text, setText] = useState<string>(value || "");

    const btText = options?.buttontext || "Ändra"


    const onChange = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        onsubmitHandler && text !== "" && onsubmitHandler({ text: text })
        if (options?.emptyOnSubmit)
            setText(() => "")
    };


    function renderHeading(headingText: string | ReactNode | undefined): ReactNode {
        if (!headingText)
            return null;

        return <div className="m-2">{headingText}</div>

    }

    return (
        <form className="p-2" >
            {renderHeading(options?.headingText)}

            <textarea
                className="w-full px-3 py-3 rounded-lg text-black "
                name="name"
                value={text}
                onChange={event => setText(event.target.value)}
                rows={4}
                placeholder={placeholder}
            ></textarea><br />

            <button
                className="mt-4 mb-3 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => onChange(event)}>{btText}</button>
        </form>
    )
}

