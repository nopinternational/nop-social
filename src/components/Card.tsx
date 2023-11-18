import { type ReactNode } from "react"

export type CardProps = {
    header: ReactNode
    children: ReactNode

}
export const Card = ({ header, children }: CardProps) => {
    return (
        <div className="flex flex-col gap-4 rounded-xl bg-white/10 mb-4 p-4 text-white hover:bg-white/20">
            <h3 className="text-2xl font-bold">{header}</h3>
            <div className="text-lg">
                {children}
            </div>
        </div>

    )
}