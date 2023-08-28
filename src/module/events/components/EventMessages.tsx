
import HighlightText from "~/components/HighlightText";
import { EventMessage } from "./types";
import { api } from "~/utils/api";
import TextEditForm, { TextEditFormOptions } from "~/components/TextEditForm";


export const EventMessages = ({ eventid }) => {
    console.log("EventMessages.eventid:", eventid)
    const trpc_message_object = api.event.getEventMessages.useQuery(
        { eventId: eventid }
    )

    // const messages = [a_message, a_message, a_message]

    // const trpc_message_object = {
    //     loading: false,
    //     data: messages
    // }
    const renderMessages = (trpc_message_object) => {
        console.log("renderMessages -> isloading", trpc_message_object.isLoading)
        console.log("renderMessages -> data", trpc_message_object.data)
        console.log("renderMessages", trpc_message_object)

        if (trpc_message_object.loading) {
            return (
                <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
                    <h3 className="text-2xl font-bold"><HighlightText>Laddar meddelenden...</HighlightText></h3>


                    <div className="h-12 w-12 mb-4">
                        <div className="flex">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full absolute
                            border-8 border-solid border-gray-200"></div>
                                <div className="w-12 h-12 rounded-full animate-spin absolute
                            border-8 border-solid border-[hsl(280,100%,70%)] border-t-transparent shadow-md"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
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
    const textEditFormOptions: TextEditFormOptions= { buttontext: "skicka" }

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
                        <div>
                            <TextEditForm description="desxcrop" options={textEditFormOptions}></TextEditForm>
                    </div>
                </div>
                <div className="text-black text-lg whitespace-pre-wrap p-2 bg-white/10 rounded-md">
                    <input placeholder="lämna ert medelenade här"></input>
                    <button className="rounded-full bg-white/10 bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[hsl(280,100%,70%)]">
                        Skicka
                    </button>
                </div>
            </div>
            {renderMessages(trpc_message_object)}

        </div>
        </div >

    )
}




const Message = ({ messageObject }: { messageObject: EventMessage }) => {
    console.log("Message.messageObject", messageObject)
    return (
        <div>
            <div><HighlightText>{messageObject.from.username}</HighlightText> säger:</div>
            <div className="text-lg whitespace-pre-wrap p-2 bg-white/10 rounded-md">
                {messageObject.message}
            </div>
        </div>
    )
}