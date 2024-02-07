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
  }: AChatMessage): Promise<string> => {
    console.log("persist event", chatConvoId, fromUserId, chatMessage);

    const eventsRef = this.firestore.collection(CHATMESSAGE_COLLECTION);

    const docRef = eventsRef.doc();
    await docRef.set({ chatConvoId, fromUserId, chatMessage });

    return docRef.id;
  };

  getChatMessages = async (messageCollection: string) => {
    const messageCollectionRef = this.firestore
      .collection(CHATMESSAGE_COLLECTION)
      .doc(messageCollection)
      .collection("messages");

    const snapshot = await messageCollectionRef.get();

    const messages = [];
    snapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
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
