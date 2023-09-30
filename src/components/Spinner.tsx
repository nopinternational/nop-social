
export const Spinner = () => {
    return (
        <div className="flex h-12">
            <div className="relative">
                <div className="w-12 h-12 rounded-full absolute
                            border-8 border-solid border-gray-200"></div>
                <div className="w-12 h-12 rounded-full animate-spin absolute
                            border-8 border-solid border-[hsl(280,100%,70%)] border-t-transparent shadow-md"></div>
            </div>
        </div>
    )
}