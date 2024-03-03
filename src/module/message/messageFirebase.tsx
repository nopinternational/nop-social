import { firestoreAdmin } from "~/server/api/firebaseAdmin";

const firestore: FirebaseFirestore.Firestore = firestoreAdmin;

import {
  type QueryDocumentSnapshot,
  type FirestoreDataConverter,
} from "firebase-admin/firestore";
import { type Message } from "~/components/Message/ChatMessage";
import { useAmp } from "next/amp";
import { type ConversationGroup } from "~/pages/app/message";

export type MessageFirestoreModel = {
  chatConvoId: string;
  fromUserId: string;
  fromUser: string;
  chatMessage: string;
  when: string;
};

export type GroupFirestoreModel = {
  createdBy: string;
  members: string[];
  lastMessage: string;
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
export const getGroups = async (userId: string) => {
  const db = new FirbaseChatMessageClient(firestore);
  return db.getGroups(userId);
};

export const persistChatMessage = async (message: Message) => {
  const db = new FirbaseChatMessageClient(firestore);
  return db.storeChatMessage(message);
};

const CHATMESSAGE_COLLECTION = "message";
const GROOUP_COLLECTION = "group";

class FirbaseChatMessageClient {
  firestore: FirebaseFirestore.Firestore;

  constructor(firestoreApp: FirebaseFirestore.Firestore) {
    this.firestore = firestoreApp;
  }

  storeChatMessage = async (message: Message): Promise<void> => {
    console.log("persist message", message);

    const groupRef = this.firestore
      .collection(GROOUP_COLLECTION)
      .doc(message.id);

    await groupRef.set(
      { when: message.when, lastMessage: message.message },
      { merge: true }
    );

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

  getGroups = async (userId: string): Promise<ConversationGroup[]> => {
    // console.log("getChatMessages", messageCollection);
    const groupRef = this.firestore
      .collection(GROOUP_COLLECTION)
      .where("members", "array-contains", userId)
      .withConverter(groupConverter);

    const allGroups: ConversationGroup[] = [];

    const snapshot = await groupRef.get();

    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log("getGroups: data=", data);
      allGroups.push(data);
    });
    // const foo = groupRef.onSnapshot(await (snapshot) => {
    //   snapshot.forEach((doc) => {
    //     const data = doc.data();
    //     // data.id = doc.id;
    //     console.log("getGroups: data=", data);
    //     // if (data.recentMessage) allGroups.push(data);
    //     allGroups.push(doc.id);
    //   });
    // });
    // console.log("getGroups foo", foo);
    console.log("getGroups return: ", allGroups);
    return allGroups;
    // .doc(messageCollection)
    // .collection("messages")
    // .orderBy("when", "asc")
    // .withConverter(messageConverter);

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
  };
}

const groupConverter: FirestoreDataConverter<ConversationGroup> = {
  toFirestore: (conversationGroup: ConversationGroup): GroupFirestoreModel => {
    return {
      createdBy: "someone",
      members: [],
      lastMessage: conversationGroup.lastMessage,
      when: new Date().toISOString(),
    };
  },

  fromFirestore: (
    snapshot: QueryDocumentSnapshot<GroupFirestoreModel>
    //options: SnapshotOptions
  ): ConversationGroup => {
    const data = snapshot.data();

    // return { id: snapshot.id, ...data };
    return {
      conversationId: snapshot.id,
      lastMessage: data.lastMessage,
      username: data.members[0] || "",
      members: data.members,
      when: data.when,
    };
  },
};

const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore: (message: Message): MessageFirestoreModel => {
    return {
      fromUserId: message.fromId,
      fromUser: message.from,
      chatConvoId: message.id,
      chatMessage: message.message,
      when: message.when,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<MessageFirestoreModel>
    //options: SnapshotOptions
  ): Message => {
    const data = snapshot.data();

    // return { id: snapshot.id, ...data };
    return {
      from: data.fromUser || data.fromUserId,
      fromId: data.fromUserId,
      id: snapshot.id,
      message: data.chatMessage,
      when: data.when,
    };
  },
};
