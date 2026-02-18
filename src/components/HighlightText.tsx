import type { ReactNode } from "react";

type Props = {
    children?: ReactNode
}

const HighlightText = ({ children }: Props) => {
    if (children)
        return (
            <span className="text-[hsl(280,100%,70%)]">{children}</span>
        );
    return null;
};

export default HighlightText;