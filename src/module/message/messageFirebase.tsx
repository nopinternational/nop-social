import { firestoreAdmin } from "~/server/api/firebaseAdmin";

const firestore: FirebaseFirestore.Firestore = firestoreAdmin;

import {
  type QueryDocumentSnapshot,
  type FirestoreDataConverter,
} from "firebase-admin/firestore";
import { type Message } from "~/components/Message/ChatMessage";

export type MessageFirestoreModel = {
  chatConvoId: string;
  fromUserId: string;
  chatMessage: string;
};

export const persistChatMessage = async (
  aChatMessage: MessageFirestoreModel
) => {
  const db = new FirbaseChatMessageClient(firestore);
  return db.persistChatMessage(aChatMessage);
};
export const getChatMessages = async (messageCollection: string) => {
  const db = new FirbaseChatMessageClient(firestore);
  return db.getChatMessages(messageCollection);
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
  }: MessageFirestoreModel): Promise<string> => {
    console.log("persist event", chatConvoId, fromUserId, chatMessage);

    const eventsRef = this.firestore.collection(CHATMESSAGE_COLLECTION);

    const docRef = eventsRef.doc();
    await docRef.set({ chatConvoId, fromUserId, chatMessage });

    return docRef.id;
  };

  getChatMessages = async (messageCollection: string): Promise<Message[]> => {
    const messageCollectionRef = this.firestore
      .collection(CHATMESSAGE_COLLECTION)
      .doc(messageCollection)
      .collection("messages")
      .withConverter(messageConverter);

    const snapshot = await messageCollectionRef.get();

    const messages: Message[] = [];
    snapshot.forEach((doc) => {
      console.log("getChatMessages", doc.id, doc.data());
      messages.push(doc.data());
    });

    return messages;

    // if (snapshot.exists) {
    //   console.log(
    //     "FirbaseAdminClient.getChatMessages -> snapshot.data()",
    //     snapshot.data()
    //   );
    //   return snapshot.data();
    // } else {
    //   // docSnap.data() will be undefined in this case
    //   // console.log("No such event!", eventid);
    // }
    // return null;
  };
}
const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore: (message: Message): MessageFirestoreModel => {
    return {
      fromUserId: message.from,
      chatConvoId: message.id,
      chatMessage: message.message,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<MessageFirestoreModel>
    //options: SnapshotOptions
  ): Message => {
    const data = snapshot.data();

    // return { id: snapshot.id, ...data };
    return {
      from: data.fromUserId,
      id: data.chatConvoId,
      message: data.chatMessage,
    };
  },
};
