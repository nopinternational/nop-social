import { firestoreAdmin } from "~/server/api/firebaseAdmin";

const firestore: FirebaseFirestore.Firestore = firestoreAdmin;

import {
  type QueryDocumentSnapshot,
  type FirestoreDataConverter,
} from "firebase-admin/firestore";
import {
  type ConvoWithMessages,
  type ConversationGroup,
  type Message,
} from "~/components/Message/ChatMessage";
import { getProfileByUserIdFromFirestore } from "../profile/firebaseProfiles";
import { type Profile } from "../profile/profileRouter";

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
): Promise<Message[]> => {
  const db = new FirbaseChatMessageClient(firestore);
  return db.getChatMessages(messageCollection);
};

export const getConvoAndMessages = async (
  messageCollection: string
): Promise<ConvoWithMessages> => {
  const db = new FirbaseChatMessageClient(firestore);
  return db.getConvoAndMessages(messageCollection);
};

export const getGroups = async (
  userId: string
): Promise<ConversationGroup[]> => {
  const db = new FirbaseChatMessageClient(firestore);
  return db.getGroupsWithProfiles(userId);
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

  getGroupsWithProfiles = async (
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
    // const participantsIds = groups.members.filter((userid) => userid != userId);

    // console.log("getGroupsWithProfiles.participantsIds", participantsIds);
    // // const userProfiles = ["hello"];
    // const userProfiles = this.getProfiles(participantsIds);

    // console.log("userProfiles", userProfiles);
    return groups;
  };

  getProfiles = (userid: string[]): Promise<Profile | null>[] => {
    return userid.map(async (uid) => {
      return await getProfileByUserIdFromFirestore(uid);
    });
  };

  getGroups = async (userId: string): Promise<ConversationGroup[]> => {
    // console.log("getChatMessages", messageCollection);
    const groupRef = this.firestore
      .collection(GROOUP_COLLECTION)
      .where("members", "array-contains", userId)
      .withConverter(groupConverter);

    const profilesColllectionRef = this.firestore.collection("profiles");
    const allGroups: ConversationGroup[] = [];

    const snapshot = await groupRef.get();
    const uspr = [];
    snapshot.forEach((groupDoc) => allGroups.push(groupDoc.data()));
    // const foo =snapshot.forEach(async (doc) => {
    //   const data = doc.data();
    //   console.log("getGroups: data=", data);
    //   allGroups.push(data);
    //   const userProfiles = await data.members
    //     .filter((userid) => userid != userId)
    //     .map(async (uid) => {
    //       console.log("+++222++++++++ p2_async BEFORE");
    //       const p2_async = await getProfileByUserIdFromFirestore(
    //         "7K7PxXthSmblBF8uJIQN2zWMCyw1"
    //       ).then((profile) => {
    //         console.log(
    //           "FETCHED ------------------------------ profile",
    //           profile
    //         );
    //         return profile;
    //       });
    //       console.log("+++222++++++++ p2_async", p2_async);
    //       // return "--" + uid + "--";
    //       return p2_async;
    //     });

    //   data.profiles = userProfiles;
    //   return data;
    // });
    console.log("allgroups befor getuser", allGroups);
    // let i = 1;
    // let members_map;
    // const foo = await allGroups.map(async (group) => {
    //   const members = group.members;
    //   group.counter = i++;
    //   group.groupUsers = [];
    //   members_map = await members
    //     .filter((userid) => userid != userId)
    //     .map(async (uid) => {
    //       console.log("get user for member uid: ", uid);
    //       group.groupUsers.push({ profileid: uid, profileName: "--" + uid });
    //       // void (async () => {
    //       //   const userFromFirebase = await getProfileByUserIdFromFirestore(uid);
    //       //   console.log("============= userFromFirebase: ", userFromFirebase);
    //       // })();
    //       //const userFromFirebase = await getProfileByUserIdFromFirestore(uid);
    //       const userFromFirebase = this.getProfile(uid);
    //       console.log("+++++++++++ p2_async BEFORE");
    //       const p2_async = await getProfileByUserIdFromFirestore(
    //         "7K7PxXthSmblBF8uJIQN2zWMCyw1"
    //       );
    //       console.log("+++++++++++ p2_async", p2_async);
    //       console.log("============= userFromFirebase: ", userFromFirebase);
    //       console.log("at the end of foreach");
    //       return await p2_async;
    //     });

    //   console.log("members_map!!!!!!!!!!!!!!!!", members_map);
    //   return members_map;
    // });
    // console.log("!!!!!!!!members_map!!!!!!!!!!!!!!!!", members_map);
    // console.log("!!!!!!!!foo!!!!!!!!!!!!!!!!", foo);
    // members.forEach(async (userid) => {

    //   const userDoc = await profilesColllectionRef.doc(userid).get();
    //   if (userDoc.exists) {
    //     const userProfileData = userDoc.data();
    //     console.log("fetch userProfileData:", userProfileData);

    //     const up = {
    //       profileName: userProfileData.username,
    //       profileId: userDoc.id,
    //     };
    //     uspr.push(up);
    //     console.log("up: ", up);
    //     // return up;
    //   } else {
    //     // return null;
    //   }
    // });

    // console.log("fetch userprofiles:", uspr);

    console.log("----------------------getGroups return: ", allGroups);

    return allGroups;
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

  getConvoAndMessages = async (
    messageCollection: string
  ): Promise<ConvoWithMessages> => {
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
      conversation: conversation_dummy,
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
