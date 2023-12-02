import HighlightText from "~/components/HighlightText";
import { TextEditForm, type TextEditFormOptions } from "~/components/TextEditForm";
import { api } from "~/utils/api";

const SendAMessageForm = ({ profileId, username }: { profileId: string, username: string }) => {


    const { mutate: sendChatMessage } = api.chat.sendChatMessage.useMutation()

    function postMessageHandler(description: { description: string; }): void {
        alert("tack för att du vill testa att skicka ett meddelande, men det är inget som fungerar ännu 😟");
        console.log("send a message to: ", profileId)
        console.log("message: ", description.description)
        const chatConvoId = "123"
        const fromUserId = "fromUserId"
        const message = description.description
        sendChatMessage({
            chatConvoId: chatConvoId,
            fromUserId: fromUserId,
            chatMessage: message
        })
    }

    const OPTIONS: TextEditFormOptions = {
        buttontext: "Skicka",
        headingText: <>Skriv ett meddelande till <HighlightText>{username}</HighlightText></>,
        emptyOnSubmit: true
    }

    return (
        <TextEditForm onsubmitHandler={postMessageHandler} placeholder="" options={OPTIONS} ></TextEditForm>
    )
}

export default SendAMessageForm
