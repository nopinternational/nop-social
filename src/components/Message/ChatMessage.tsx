import HighlightText from "../HighlightText";
import { TextEditForm, type TextEditFormOptions } from "../TextEditForm";

export type MessageToUser = {
  toProfileId: string;
  message: string;
};

export type ConversationMessage = {
  conversationId: string;
  messageId: string;
  from: string;
  fromId: string;
  message: string;
  when: string;
};

export type ConversationGroup = {
  // [x: string]: any;
  conversationId: string;
  username: string;
  lastMessage: string;
  members: string[];
  when: string;
  chatMembers?: ChatMember[];
  conversationGroupName: string;
};

export type ChatMember = {
  profileid: string;
  profilename: string;
};

export type ConvoWithMessages = {
  conversation: ConversationGroup;
  messages: ConversationMessage[];
};

export const ChatMessage = ({
  message,
  fromMe,
}: {
  message: ConversationMessage;
  fromMe: boolean;
}) => {
  //  new Date(message.when).toLocaleString();

  const whenStr = message.when;

  return (
    <>
      {fromMe ? (
        <div className="pl-10">
          <p className="whitespace-pre-wrap rounded-xl bg-white/10 p-2">
            {message.message}
          </p>
          <p className="text-right text-xs">{whenStr}</p>
        </div>
      ) : (
        <div className="pr-10">
          <p>
            <HighlightText>{message.from}</HighlightText> säger:
          </p>
          <p className="whitespace-pre-wrap rounded-xl bg-white/10 p-2">
            {message.message}
          </p>
          <p className="text-right text-xs">{whenStr}</p>
        </div>
      )}
      {/* <div className="flex col-span-1 items-center justify-center pt-2">
                <ProfilePic />
            </div>
            <div className="col-span-3">
                <h3 className="text-2xl font-bold"><HighlightText>{convo.username}</HighlightText></h3>
                <p className=" p-2 rounded-xl bg-white/10 whitespace-pre-wrap italic" >{convo.lastMessage}</p>
            </div> */}
    </>
  );
};

type SendChatMessageFormProps = {
  toUsername: string;
  postMessageHandler?: ({ text }: { text: string }) => void;
  options?: TextEditFormOptions;
};

export const SendChatMessageForm = ({
  toUsername,
  postMessageHandler,
  options,
}: SendChatMessageFormProps): JSX.Element => {
  const DEFAULT_OPTIONS: TextEditFormOptions = {
    buttontext: "Skicka",
    headingText: (
      <>
        Skriv ett meddelande till <HighlightText>{toUsername}</HighlightText>
      </>
    ),
    emptyOnSubmit: true,
  };
  return (
    <TextEditForm
      onsubmitHandler={postMessageHandler}
      placeholder=""
      options={{ ...DEFAULT_OPTIONS, ...options }}
    ></TextEditForm>
  );
};
