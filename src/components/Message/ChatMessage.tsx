import HighlightText from "../HighlightText"
import { TextEditForm, type TextEditFormOptions } from "../TextEditForm"

export type Message = {
    id: string
    from: string
    message: string
}

export const ChatMessage = ({ message, fromMe }: { message: Message, fromMe: boolean }) => {

    return (
        <>
            {fromMe ?
                <div className="pl-10">

                    <p className="p-2  rounded-xl bg-white/10 whitespace-pre-wrap italic" >{message.message}</p>
                </div> :
                <div className="pr-10">
                    <p><HighlightText>{message.from}</HighlightText> säger:</p>
                    <p className="p-2 rounded-xl bg-white/10 whitespace-pre-wrap italic" >{message.message}</p>
                </div>
            }
            {/* <div className="flex col-span-1 items-center justify-center pt-2">
                <ProfilePic />
            </div>
            <div className="col-span-3">
                <h3 className="text-2xl font-bold"><HighlightText>{convo.username}</HighlightText></h3>
                <p className=" p-2 rounded-xl bg-white/10 whitespace-pre-wrap italic" >{convo.lastMessage}</p>
            </div> */}
        </ >
    )
}

export const SendChatMessageForm = ({ toUsername, postMessageHandler }: { toUsername: string, postMessageHandler?: (description: { description: string }) => void }) => {
    const OPTIONS: TextEditFormOptions = {
        buttontext: "Skicka",
        headingText: <>Skriv ett meddelande till <HighlightText>{toUsername}</HighlightText></>,
        emptyOnSubmit: true
    }
    return <TextEditForm onsubmitHandler={postMessageHandler} placeholder="" options={OPTIONS} ></TextEditForm>
}