
type Props = {
    children: JSX.Element | string | null | undefined
}

const HighlightText = ({ children }: Props) => {
    if (children)
        return (
            <span className="text-[hsl(280,100%,70%)]">{children}</span>
        );
    return null;
};

export default HighlightText;