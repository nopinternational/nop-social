import { firestoreAdmin } from "~/server/api/firebaseAdmin";

const firestore: FirebaseFirestore.Firestore = firestoreAdmin;

export type AChatMessage = {
  chatConvoId: string;
  fromUserId: string;
  chatMessage: string;
};

export const persistChatMessage = async (aChatMessage: AChatMessage) => {
  const db = new FirbaseChatMessageClient(firestore);
  return db.persistChatMessage(aChatMessage);
};

const CHATMESSAGE_COLLECTION = "message";
class FirbaseChatMessageClient {
  firestore: FirebaseFirestore.Firestore;
  constructor(firestoreApp: FirebaseFirestore.Firestore) {
    this.firestore = firestoreApp;
  }
  persistChatMessage = async ({
    chatConvoId,
    fromUserId,
    chatMessage,
  }: AChatMessage): Promise<string> => {
    console.log("persist event", chatConvoId, fromUserId, chatMessage);

    const eventsRef = this.firestore.collection(CHATMESSAGE_COLLECTION);

    const docRef = eventsRef.doc();
    await docRef.set({ chatConvoId, fromUserId, chatMessage });

    return docRef.id;
  };
}
