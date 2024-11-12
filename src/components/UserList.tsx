
export function UserList({ usernames }: { usernames: string[] }) {
    return <div className="max-w shrink-0 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className=" items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Participants</h5>
        </div>
        <div className="flex flex-row flex-wrap gap-2">

            {usernames.map((username) => {
                return (
                    <div key={username} className="flex-8 space-x-4 flex-8 min-w-0">
                        <button
                            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 truncate"
                            onClick={() => null}
                        > {username}</button>
                    </div>
                );
            })}

            {usernames.map((username) => {
                return (
                    <div key={username} className="flex-8 space-x-4 flex-8 min-w-0">
                        <button
                            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 truncate"
                            onClick={() => null}
                        > {username}</button>
                    </div>
                );
            })}

        </div>
    </div>;
}
