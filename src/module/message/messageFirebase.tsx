import { firestoreAdmin } from "~/server/api/firebaseAdmin";

const firestore: FirebaseFirestore.Firestore = firestoreAdmin;

import {
  type QueryDocumentSnapshot,
  type FirestoreDataConverter,
} from "firebase-admin/firestore";
import {
  type ConvoWithMessages,
  type ConversationGroup,
  type ConversationMessage,
} from "~/components/Message/ChatMessage";
import { getProfileByUserIdFromFirestore } from "../profile/firebaseProfiles";
import { type Profile } from "../profile/profileRouter";
import { type APIMessageToUser } from "./types";

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

export const persistChatMessageToUser = async (message: APIMessageToUser) => {
  const db = new FirbaseChatMessageClient(firestore);
  return db.persistChatMessageToUser(message);
};

const CHATMESSAGE_COLLECTION = "message";
const GROUP_COLLECTION = "group";

type CreateConversationGroup = {
  createdBy: string;
  lastMessage: string;
  members: string[];
  when: string;
};

class FirbaseChatMessageClient {
  firestore: FirebaseFirestore.Firestore;

  constructor(firestoreApp: FirebaseFirestore.Firestore) {
    this.firestore = firestoreApp;
  }

  storeChatMessage = async (message: ConversationMessage): Promise<void> => {
    console.log("persist message", message);

    // first: update group meta
    const groupRef = this.firestore
      .collection(GROUP_COLLECTION)
      .doc(message.conversationId);

    await groupRef.set(
      { when: message.when, lastMessage: message.message },
      { merge: true }
    );

    // second: add message to message collection
    const messageCollectionRef = this.firestore
      .collection(CHATMESSAGE_COLLECTION)
      .doc(message.conversationId)
      .collection("messages")
      .withConverter(messageConverter);

    const setreturn = await messageCollectionRef.doc().set(message);
    console.log("set message", setreturn);
  };

  createGroup = async (
    converasationGroup: CreateConversationGroup
  ): Promise<ConversationGroup> => {
    const groupDocRef = this.firestore.collection(GROUP_COLLECTION).doc();
    const setReturn = await groupDocRef.set({ ...converasationGroup });

    return converasationGroup;
  };

  getGroupForUsers = async (
    userIdList: string[]
  ): Promise<ConversationGroup> => {
    console.log("getGroupForUsers", userIdList);
    const userIdsPermutations = [
      ["7K7PxXthSmblBF8uJIQN2zWMCyw1", "b4Qf3UhNP3PrI0dfJCLpfL2ckwr2"],
      ["b4Qf3UhNP3PrI0dfJCLpfL2ckwr2", "7K7PxXthSmblBF8uJIQN2zWMCyw1"],
    ];
    const groupRef = this.firestore
      .collection(GROUP_COLLECTION)
      .where("members", "in", userIdsPermutations)
      .withConverter(groupConverter);

    const allGroups: ConversationGroup[] = [];

    const snapshot = await groupRef.get();
    snapshot.forEach((groupDoc) => allGroups.push(groupDoc.data()));
    console.log("getGroupForUsers:", allGroups);

    if (allGroups && allGroups.length > 0) {
      return allGroups[0] as ConversationGroup;
    } else {
      return null;
    }
  };

  getOrCreateGroup = async (
    message: APIMessageToUser
  ): Promise<ConversationGroup> => {
    const existingGroup = await this.getGroupForUsers([
      message.fromProfileId,
      message.toProfileId,
    ]);

    if (existingGroup) {
      return existingGroup;
    } else {
      const createGroup: CreateConversationGroup = {
        createdBy: message.fromProfileId,
        lastMessage: message.message,
        members: [message.fromProfileId, message.toProfileId],
        when: new Date().toISOString(),
      };
      const createdGroup = await this.createGroup(createGroup);
      return createdGroup;
    }
  };
  // createGroup = async (createGroup: CreateConversationGroup) => {
  //   if (!group) {
  //     const createGroup: CreateConversationGroup = {
  //   createdBy: message.fromProfileId,
  //   lastMessage: message.message,
  //   members: [message.fromProfileId, message.toProfileId],
  //   when: new Date().toISOString(),

  // };

  // this.createGroup(createGroup)
  //     const createdGroup = await this.createGroup(createGroup);
  //     console.log("creeatedGroup: ", createGroup);
  //   }
  //   // ELSE create
  // };
  persistChatMessageToUser = async (
    message: APIMessageToUser
  ): Promise<void> => {
    console.log("persist message", message);

    // get conversation if exist
    const group = await this.getGroupForUsers([
      message.toProfileId,
      message.fromProfileId,
    ]);
    console.log("got group", group);

    // const groupRef = this.firestore
    //   .collection(GROUP_COLLECTION)
    //   .doc(group?.conversationId);

    // await groupRef.set(
    //   { when: new Date().toISOString(), lastMessage: message.message },
    //   { merge: true }
    // );

    const messageCollectionDocRef = this.firestore
      .collection(CHATMESSAGE_COLLECTION)
      .doc(group.conversationId);
    //const messCollecDoc = await messageCollectionDocRef.set({});
    console.log("messagecollection doc ref: ", messageCollectionDocRef.id);
    await messageCollectionDocRef.set({ hello: "world" });
    const messageCollectionRef = messageCollectionDocRef
      .collection("messages")
      .doc();
    // //await messageCollectionRef.create();

    // //.withConverter(messageConverter);

    const setreturn = await messageCollectionRef.set(message);
    // console.log("set message", setreturn);
  };

  // storeChatMessage_old = async ({
  //   chatConvoId,
  //   fromUserId,
  //   chatMessage,
  // }: MessageFirestoreModel): Promise<string> => {
  //   console.log("persist event", chatConvoId, fromUserId, chatMessage);

  //   const eventsRef = this.firestore.collection(CHATMESSAGE_COLLECTION);

  //   const docRef = eventsRef.doc();
  //   await docRef.set({ chatConvoId, fromUserId, chatMessage });

  //   return docRef.id;
  // };

  getConvoGroupsWithProfiles = async (
    userId: string
  ): Promise<ConversationGroup[]> => {
    const groups = await this.getGroups(userId);
    console.log("getGroupsWithProfiles.groups", groups);

    for (const group of groups) {
      const memberProfiles = await Promise.all(
        this.getProfiles(group.members.filter((uid) => uid != userId))
      );
      console.log("--++-- memberProfiles1", memberProfiles);

      group.chatMembers = memberProfiles.map((profile) => {
        return {
          profileid: profile?.id || "",
          profilename: profile?.username || "",
        };
      });
      console.log("group.chatmembers", group, group.chatMembers);
    }

    return groups;
  };

  getProfiles = (userid: string[]): Promise<Profile | null>[] => {
    return userid.map(async (uid) => {
      return await getProfileByUserIdFromFirestore(uid);
    });
  };

  getGroup = async (
    convoGroupId: string
  ): Promise<ConversationGroup | null> => {
    // console.log("getChatMessages", messageCollection);
    const groupRef = this.firestore
      .collection(GROUP_COLLECTION)
      .doc(convoGroupId)
      // .where("members", "array-contains", "userId")
      .withConverter(groupConverter);

    const allGroups: ConversationGroup[] = [];

    const doc = await groupRef.get();
    if (doc.exists) {
      const group = doc.data() as ConversationGroup;
      console.log("found convoGroup", convoGroupId, group);
      return group;
    }
    return null;
  };

  getGroups = async (userId: string): Promise<ConversationGroup[]> => {
    // console.log("getChatMessages", messageCollection);
    const groupRef = this.firestore
      .collection(GROUP_COLLECTION)
      .where("members", "array-contains", userId)
      .withConverter(groupConverter);

    const allGroups: ConversationGroup[] = [];

    const snapshot = await groupRef.get();
    snapshot.forEach((groupDoc) => allGroups.push(groupDoc.data()));

    console.log("allgroups befor getuser", allGroups);
    console.log("----------------------getGroups return: ", allGroups);

    return allGroups;
  };

  getChatMessages = async (
    messageCollection: string
  ): Promise<ConversationMessage[]> => {
    // console.log("getChatMessages", messageCollection);
    const messageCollectionRef = this.firestore
      .collection(CHATMESSAGE_COLLECTION)
      .doc(messageCollection)
      .collection("messages")
      .orderBy("when", "asc")
      .withConverter(messageConverter);

    const snapshot = await messageCollectionRef.get();

    const messages: ConversationMessage[] = [];
    snapshot.forEach((doc) => {
      //console.log("getChatMessages", doc.id, doc.data());
      messages.push(doc.data());
    });

    return messages;
  };

  getConvoAndMessages = async (
    messageCollectionId: string,
    myUserId: string
  ): Promise<ConvoWithMessages> => {
    // console.log("getChatMessages", messageCollection);
    const messageCollectionRef = this.firestore
      .collection(CHATMESSAGE_COLLECTION)
      .doc(messageCollectionId)
      .collection("messages")
      .orderBy("when", "asc")
      .withConverter(messageConverter);

    const snapshot = await messageCollectionRef.get();

    const messages: ConversationMessage[] = [];
    snapshot.forEach((doc) => {
      //console.log("getChatMessages", doc.id, doc.data());
      messages.push(doc.data());
    });

    const group = (await this.getGroup(
      messageCollectionId
    )) as ConversationGroup;

    const memberProfiles = await Promise.all(
      this.getProfiles(group.members.filter((uid) => uid != myUserId))
    );
    console.log("--++-- memberProfiles1", memberProfiles);

    group.chatMembers = memberProfiles.map((profile) => {
      return {
        profileid: profile?.id || "",
        profilename: profile?.username || "",
      };
    });
    const conversation_dummy: ConversationGroup = {
      conversationId: "convoid",
      lastMessage: "lastmessage",
      username: "username",
      when: "2024-03-03T11:43:06.626Z",
      members: ["123", "456"],
      chatMembers: [{ profileid: "222", profilename: "cyklop" }],
      conversationGroupName: "cyklop",
    };

    const convoWithMessages: ConvoWithMessages = {
      messages: messages,
      conversation: group,
    };

    return convoWithMessages;
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
      conversationGroupName: "",
    };
  },
};

const messageConverter: FirestoreDataConverter<ConversationMessage> = {
  toFirestore: (message: ConversationMessage): MessageFirestoreModel => {
    return {
      fromUserId: message.fromId,
      fromUser: message.from,
      chatConvoId: message.conversationId,
      chatMessage: message.message,
      when: message.when,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<MessageFirestoreModel>
    //options: SnapshotOptions
  ): ConversationMessage => {
    const data = snapshot.data();

    // return { id: snapshot.id, ...data };
    return {
      from: data.fromUser || data.fromUserId,
      fromId: data.fromUserId,
      conversationId: snapshot.id,
      message: data.chatMessage,
      when: data.when,
    };
  },
};
