
import HighlightText from "~/components/HighlightText";
export const EventMessages = () => {

    const a_message: EventMessageProps = {
        "profileName": "sthlmpar08",
        "message": "Vi är så glada att få träffa alla igen\n\nHurra!"
    }
    const messages = [a_message, a_message, a_message]

    const trpc_message_object = {
        loading: false,
        data: []
    }
    const renderMessages = (trpc_message_object) => {

        if (trpc_message_object.loading) {
            return "messages are loading..."
        }

        if (trpc_message_object.data) {
            if (trpc_message_object.data.length == 0) {
                return (
                    <div className="text-lg italic whitespace-pre-wrap p-2 bg-white/10 rounded-md">
                        inga meddelande har skrivits ännu, ni kan bli dom första
                    </div>
                )
            }
            return trpc_message_object.data.map((eventMessage) => <Message key={eventMessage.message} messageObject={eventMessage}></Message>)
        }
    }

    return (
        <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
            <div className="col-span-2">
                <div
                    className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white"
                >
                    <h3 className="text-2xl font-bold">
                        Har ni något på <HighlightText>hjärtat</HighlightText>?
                    </h3>
                    <div className="text-lg whitespace-pre-wrap">
                        Lämna ett meddelande till dom andra som kommer på träffen.
                    </div>

                    <div>
                        <div><HighlightText>Skicka ett eget meddelande:</HighlightText></div>
                        <div className="text-black text-lg whitespace-pre-wrap p-2 bg-white/10 rounded-md">
                            <input placeholder="lämna ert medelenade här"></input>
                            <button className="rounded-full bg-white/10 bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[hsl(280,100%,70%)]">
                                Skicka
                            </button>
                        </div>
                    </div>
                    {renderMessages(trpc_message_object)}




                </div>
            </div>
        </div>

    )
}

interface EventMessageProps {
    profileName: string,
    message: string
}


const Message = ({ messageObject }: { messageObject: EventMessageProps }) => {
    console.log("Message.messageObject", messageObject)
    return (
        <div>
            <div><HighlightText>{messageObject.profileName}</HighlightText> säger:</div>
            <div className="text-lg whitespace-pre-wrap p-2 bg-white/10 rounded-md">
                {messageObject.message}
            </div>
        </div>
    )
}