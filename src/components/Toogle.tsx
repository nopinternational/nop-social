import { type ChangeEvent } from "react";

export const Toggle = ({
    name,
    optionText,
    checked,
    onClick,
}: {
  name: string;
  optionText: string;
  checked: boolean;
  onClick: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => {
    return (
        <label className="relative mr-5 inline-flex cursor-pointer items-center">
            <input
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                readOnly
                name={name}
                onChange={onClick}
            />
            <div
                className="peer
                h-6
                w-11
                rounded-full bg-gray-200
                after:absolute
                after:left-[2px]
                after:top-0.5 after:mt-0.5
                after:h-5 after:w-5
                after:rounded-full
                after:border
                after:border-gray-300
                after:bg-white
                after:transition-all
                after:content-['']
                peer-checked:bg-green-600
                peer-checked:after:translate-x-full
                peer-checked:after:border-white
                peer-focus:ring-green-300"
            ></div>
            <span className=" ">{optionText}</span>
        </label>
    );
};
