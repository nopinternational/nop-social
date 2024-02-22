import { api } from "~/utils/api";

export const sendMessageToUser = (message: string) => {
  console.log("sendMessageToUser", message);
  const { mutate: sendChatMessage } = api.chat.sendChatMessage.useMutation();

  const convoId = "123";
  const fromUserId = "abc123";
  const result_sendChatMessage = sendChatMessage({
    chatConvoId: convoId,
    fromUserId,
    chatMessage: message,
  });

  console.log("messagService.sendMessageToUser", result_sendChatMessage);
};
