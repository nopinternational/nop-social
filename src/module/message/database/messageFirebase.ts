import { firestoreAdmin } from "~/server/api/firebaseAdmin";

const firestore: FirebaseFirestore.Firestore = firestoreAdmin;

import {
    type FirestoreDataConverter,
    type QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { Timestamp } from "firebase/firestore";
import {
    type ConversationGroup,
    type ConversationMessage,
    type ConvoWithMessages,
} from "~/components/Message/ChatMessage";
import { getProfileByUserIdFromFirestore } from "../../profile/firebaseProfiles";
import { type Profile } from "../../profile/profileRouter";
import { type APIMessageToUser } from "../types";

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

// https://stackoverflow.com/a/37580979
function permute(permutation: string[]) {
    const length = permutation.length;
    const result = [permutation.slice()];

    const c = new Array(length).fill(0);
    let i = 1;
    let k: number;
    let p: string;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && (c[i] as number);
            p = permutation[i] as string;
            permutation[i] = permutation[k] as string;
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

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

const CHATMESSAGE_COLLECTION = "message";
const GROUP_COLLECTION = "group";
const READSTATUS_COLLECTION = "readstatus";

const LASTREAD_FIELD = "lastread";

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

    storeChatMessage = async (
        message: ConversationMessage
    ): Promise<ConversationMessage> => {
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
            .doc()
            .withConverter(messageConverter);

        await messageCollectionRef.set(message);

        message.messageId = messageCollectionRef.id;
        return message;
    };

    updateConvoMarkAsRead = (convoId: string, userId: string) => {
        const readstatusDocRef = this.firestore
            .collection(GROUP_COLLECTION)
            .doc(convoId)
            .collection(READSTATUS_COLLECTION)
            .doc(userId);

        void readstatusDocRef.set({ lastread: new Date() }, { merge: true });
    };

    createGroup = async (
        converasationGroup: CreateConversationGroup
    ): Promise<ConversationGroup> => {
        const groupDocRef = this.firestore.collection(GROUP_COLLECTION).doc();

        await groupDocRef.set({ ...converasationGroup });

        return (await this.getGroup(groupDocRef.id)) as ConversationGroup;
    };

    getGroupForUsers = async (
        userIdList: string[]
    ): Promise<ConversationGroup | null> => {
        const userIdsPermutations = permute(userIdList);
        const groupRef = this.firestore
            .collection(GROUP_COLLECTION)
            .where("members", "in", userIdsPermutations)
            .withConverter(groupConverter);

        const allGroups: ConversationGroup[] = [];

        const snapshot = await groupRef.get();
        snapshot.forEach((groupDoc) => allGroups.push(groupDoc.data()));

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

    persistChatMessageToUser = async (
        apiMessage: APIMessageToUser
    ): Promise<ConversationMessage> => {
    // get conversation if exist
        const group = await this.getOrCreateGroup(apiMessage);

        const convoMessage: ConversationMessage = {
            conversationId: group.conversationId,
            messageId: "none",
            fromId: apiMessage.fromProfileId,
            from: apiMessage.fromProfileName,
            when: new Date().toISOString(),
            message: apiMessage.message,
        };
        const storedMessage = await this.storeChatMessage(convoMessage);
        return storedMessage;
    };

    getConvoGroupsWithProfiles = async (
        userId: string
    ): Promise<ConversationGroup[]> => {
        const groups = await this.getGroups(userId);

        for (const group of groups) {
            const memberProfiles = await Promise.all(
                this.getProfiles(group.members.filter((uid) => uid != userId))
            );

            group.chatMembers = memberProfiles.map((profile) => {
                return {
                    profileid: profile?.id || "",
                    profilename: profile?.username || "",
                };
            });
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
        const groupRef = this.firestore
            .collection(GROUP_COLLECTION)
            .doc(convoGroupId)
        // .where("members", "array-contains", "userId")
            .withConverter(groupConverter);

        const doc = await groupRef.get();
        if (doc.exists) {
            const group = doc.data() as ConversationGroup;
            return group;
        }
        return null;
    };

    getGroups = async (userId: string): Promise<ConversationGroup[]> => {
        const groupRef = this.firestore
            .collection(GROUP_COLLECTION)
            .where("members", "array-contains", userId)
            .orderBy("when", "desc")
            .withConverter(groupConverter);

        const allGroups: ConversationGroup[] = [];

        const snapshot = await groupRef.get();
        snapshot.forEach((groupDoc) => {
            const dataConverted = groupDoc.data();
            this.getLastRead(groupDoc.id, userId)
                .then((lr) => {
                    dataConverted.lastread = lr;
                })
                .catch((err) => console.error(err));

            allGroups.push(dataConverted);
        });

        return allGroups;
    };

    getLastRead = async (
        convoId: string,
        userId: string
    ): Promise<Date | null> => {
        const lastReaRef = this.firestore
            .collection(GROUP_COLLECTION)
            .doc(convoId)
            .collection(READSTATUS_COLLECTION)
            .doc(userId)
            .withConverter(lastReadForUserConverter);

        const lastReadDoc = await lastReaRef.get();
        if (lastReadDoc.exists) {
            const data = lastReadDoc.data() as Readstatus;
            return data[LASTREAD_FIELD] as Date;
        }
        return null;
    };

    getChatMessages = async (
        messageCollection: string
    ): Promise<ConversationMessage[]> => {
        const messageCollectionRef = this.firestore
            .collection(CHATMESSAGE_COLLECTION)
            .doc(messageCollection)
            .collection("messages")
            .orderBy("when", "desc")
            .withConverter(messageConverter);

        const snapshot = await messageCollectionRef.get();

        const messages: ConversationMessage[] = [];
        snapshot.forEach((doc) => {
            const convoMessage: ConversationMessage = {
                ...doc.data(),
                conversationId: messageCollection,
            };
            // g("convoMessage ", convoMessage);
            messages.push(convoMessage);
        });

        return messages;
    };

    getConvoAndMessages = async (
        messageCollectionId: string,
        myUserId: string
    ): Promise<ConvoWithMessages> => {
        const messageCollectionRef = this.firestore
            .collection(CHATMESSAGE_COLLECTION)
            .doc(messageCollectionId)
            .collection("messages")
            .orderBy("when", "asc")
            .withConverter(messageConverter);

        const snapshot = await messageCollectionRef.get();

        const messages: ConversationMessage[] = [];
        snapshot.forEach((doc) => {
            messages.push({ ...doc.data(), conversationId: messageCollectionId });
        });

        const group = (await this.getGroup(
            messageCollectionId
        )) as ConversationGroup;

        const memberProfiles = await Promise.all(
            this.getProfiles(group.members.filter((uid) => uid != myUserId))
        );

        group.chatMembers = memberProfiles.map((profile) => {
            return {
                profileid: profile?.id || "",
                profilename: profile?.username || "",
            };
        });
        // const conversation_dummy: ConversationGroup = {
        //   conversationId: "convoid",
        //   lastMessage: "lastmessage",
        //   username: "username",
        //   when: "2024-03-03T11:43:06.626Z",
        //   members: ["123", "456"],
        //   chatMembers: [{ profileid: "222", profilename: "cyklop" }],
        //   conversationGroupName: "cyklop",
        // };

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
            lastread: null,
        };
    },
};
type ReadstatusFirestoreModel = {
  lastread: Timestamp;
};
type Readstatus = {
  lastread: Date | null;
};
const lastReadForUserConverter: FirestoreDataConverter<Readstatus> = {
    toFirestore: (readstatus: Readstatus): ReadstatusFirestoreModel => {
    /* TODO implement*/

        return {
            lastread: Timestamp.fromDate(readstatus.lastread || new Date()),
        };
    },
    fromFirestore: (
        snapshot: QueryDocumentSnapshot<ReadstatusFirestoreModel>
    ): Readstatus => {
        return {
            lastread: snapshot.data().lastread.toDate(),
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
            messageId: snapshot.id,
            message: data.chatMessage,
            when: data.when,
        };
    },
};

// const _messageConverterForUser = (
//     userid: string
// ): FirestoreDataConverter<ConversationMessage> => {
//     return {
//         toFirestore: (message: ConversationMessage): MessageFirestoreModel => {
//             return {
//                 fromUserId: message.fromId,
//                 fromUser: message.from,
//                 chatConvoId: message.conversationId,
//                 chatMessage: message.message,
//                 when: message.when,
//             };
//         },
//         fromFirestore: (
//             snapshot: QueryDocumentSnapshot<MessageFirestoreModel>
//             //options: SnapshotOptions
//         ): ConversationMessage => {
//             const data = snapshot.data();

//             // return { id: snapshot.id, ...data };
//             return {
//                 from: data.fromUser || data.fromUserId,
//                 fromId: data.fromUserId,
//                 conversationId: snapshot.id,
//                 messageId: snapshot.id,
//                 message: data.chatMessage + "userid: - " + userid,
//                 when: data.when,
//             };
//         },
//     };
// };
