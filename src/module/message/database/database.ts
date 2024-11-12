import { type ConvoWithMessages, type ConversationMessage, type ConversationGroup } from "~/components/Message/ChatMessage";
import { FirbaseChatMessageClient } from "./firebase";
import { firestoreAdmin } from "~/server/api/firebaseAdmin";
import { type APIMessageToUser } from "../types";

const firestore: FirebaseFirestore.Firestore = firestoreAdmin;
export const getChatMessages = async (
    messageCollection: string
): Promise<ConversationMessage[]> => {
    const db = new FirbaseChatMessageClient(firestore);
    return db.getChatMessages(messageCollection);
};

export const getConvoAndMessages = async (
    messageCollectionId: string,
    userId: string
): Promise<ConvoWithMessages> => {
    const db = new FirbaseChatMessageClient(firestore);
    return db.getConvoAndMessages(messageCollectionId, userId);
};

export const getGroups = async (
    userId: string
): Promise<ConversationGroup[]> => {
    const db = new FirbaseChatMessageClient(firestore);
    return db.getConvoGroupsWithProfiles(userId);
};

export const persistChatMessage = async (message: ConversationMessage) => {
    const db = new FirbaseChatMessageClient(firestore);
    return db.storeChatMessage(message);
};

export const updateConvoMarkAsRead = (convoId: string, userId: string) => {
    const db = new FirbaseChatMessageClient(firestore);
    db.updateConvoMarkAsRead(convoId, userId);
};

export const persistChatMessageToUser = async (message: APIMessageToUser) => {
    const db = new FirbaseChatMessageClient(firestore);
    return db.persistChatMessageToUser(message);
};