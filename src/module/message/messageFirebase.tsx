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
  when: string;
};

// export const persistChatMessage = async (
//   aChatMessage: MessageFirestoreModel
// ) => {
//   const db = new FirbaseChatMessageClient(firestore);
//   return db.storeChatMessage_old(aChatMessage);
// };
export const getChatMessages = async (messageCollection: string) => {
  const db = new FirbaseChatMessageClient(firestore);
  return db.getChatMessages(messageCollection);
};
export const persistChatMessage = async (message: Message) => {
  const db = new FirbaseChatMessageClient(firestore);
  return db.storeChatMessage(message);
};

const CHATMESSAGE_COLLECTION = "message";
class FirbaseChatMessageClient {
  firestore: FirebaseFirestore.Firestore;

  constructor(firestoreApp: FirebaseFirestore.Firestore) {
    this.firestore = firestoreApp;
  }

  storeChatMessage = async (message: Message): Promise<void> => {
    console.log("persist message", message);
    console.log("persist message", message.from);
    console.log("persist message", message.id);
    console.log("persist message", message.message);

    const messageCollectionRef = this.firestore
      .collection(CHATMESSAGE_COLLECTION)
      .doc(message.id)
      .collection("messages")
      .withConverter(messageConverter);

    const setreturn = await messageCollectionRef.doc().set(message);
    console.log("set message", setreturn);
    //console.log("messageCollectionRef", messageCollectionRef);
    // void this.firestore
    //   .collection(CHATMESSAGE_COLLECTION)
    //   .doc(message.id)
    //   .collection("messages")
    //   .withConverter(messageConverter)
    //   .set(message);

    // const docRef = eventsRef.doc();
    // await docRef.set({ chatConvoId, fromUserId, chatMessage });

    // return docRef.id;
  };
  storeChatMessage_old = async ({
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
    // console.log("getChatMessages", messageCollection);
    const messageCollectionRef = this.firestore
      .collection(CHATMESSAGE_COLLECTION)
      .doc(messageCollection)
      .collection("messages")
      .orderBy("when", "asc")
      .withConverter(messageConverter);

    const snapshot = await messageCollectionRef.get();

    const messages: Message[] = [];
    snapshot.forEach((doc) => {
      //console.log("getChatMessages", doc.id, doc.data());
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
      when: new Date().toISOString(),
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
      id: snapshot.id,
      message: data.chatMessage,
      when: data.when,
    };
  },
};
