import HighlightText from "~/components/HighlightText";
import { TextEditForm, type TextEditFormOptions } from "~/components/TextEditForm";

const SendAMessageForm = ({ profileId, username }: { profileId: string, username: string }) => {

    function postMessageHandler(description: { description: string; }): void {
        alert("tack för att du vill testa att skicka ett meddelande, men det är inget som fungerar ännu 😟");
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
