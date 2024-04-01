import { type MessageToUser } from "~/components/Message/ChatMessage";

export interface APIMessageToUser extends MessageToUser {
  fromProfileId: string;
}
