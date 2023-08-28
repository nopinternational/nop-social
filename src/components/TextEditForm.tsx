import { type FC, useState } from "react";

export interface TextEditFormOptions {
    buttontext?: string
}

const TextEditForm: FC<{ description?: string, onsubmitHandler?: (description: { description: string }) => void, options?: TextEditFormOptions }> = ({ description, onsubmitHandler, options }) => {
    console.log("TextEditForm.options:", options)
    const [desc, setdescription] = useState<string>(description || "");

    const btText = options?.buttontext || "Ändra"


    const onChange = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()


        onsubmitHandler && onsubmitHandler({ description: desc })

    };
    return (
        <form className="p-2" >
            <div className="m-2">Beskrivning</div>
            <textarea
                className="w-full px-3 py-3 rounded-lg text-black "
                name="name"
                value={desc}
                onChange={event => setdescription(event.target.value)}
                rows={4}
            >{description}</textarea><br />

            <button
                className="mt-4 mb-3 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => onChange(event)}>{btText}</button>
        </form>
    )
}

export default TextEditForm