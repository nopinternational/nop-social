/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { firestoreAdmin } from "~/server/api/firebaseAdmin";
import {
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase-admin/firestore";

import {
  type NopEvent,
  type ConfirmedUser,
  type EventFirestoreModel,
  type EventMessage,
  type EventParticipant,
} from "../components/types";
import {
  type CollectionReference,
  type FirestoreDataConverter,
  FieldValue,
} from "firebase-admin/firestore";
import { type EventFormType } from "../components/NoPEventForm";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unnecessary-type-assertion
const firestore: FirebaseFirestore.Firestore = firestoreAdmin;

export const getAllEventsFromFirestore = async (): Promise<NopEvent[]> => {
  const db = new FirbaseAdminClient(firestore);
  return await db.getAllEventsFromFirestore();
};

export const getEvent = async (eventid: string): Promise<NopEvent | null> => {
  const db = new FirbaseAdminClient(firestore);
  return await db.getEvent(eventid);
};

export const getEventParticipants = async (
  eventid: string
): Promise<EventParticipant[] | null> => {
  const db = new FirbaseAdminClient(firestore);
  return await db.getEventParticipants(eventid);
};

export const getMyEventStatus = async (iam_userid: string, eventid: string) => {
  const db = new FirbaseAdminClient(firestore);
  return await db.getMyEventStatus(iam_userid, eventid);
};

export const getEventAttendes = async (iam_userid: string, eventid: string) => {
  const db = new FirbaseAdminClient(firestore);
  return await db.getEventAttendes(iam_userid, eventid);
};

export const getEventMessages = async (iam_userid: string, eventid: string) => {
  const db = new FirbaseAdminClient(firestore);
  return db.getEventMessages(iam_userid, eventid);
};

export const createEvent = async ({
  nopEvent,
  uid,
}: {
  nopEvent: EventFormType;
  uid: string;
}) => {
  const db = new FirbaseAdminClient(firestore);
  return db.createEvent(uid, nopEvent);
};

export const addAsAttende = async ({
  eventId,
  id,
  name,
  username,
  addAsAllowed,
}: {
  eventId: string;
  id: string;
  name: string;
  username: string;
  addAsAllowed: boolean;
}) => {
  const db = new FirbaseAdminClient(firestore);
  return db.addAsAttende(eventId, id, name, username, addAsAllowed);
};
export const updateEvent = async ({
  nopEvent,
  uid,
  eventId,
}: {
  nopEvent: EventFormType;
  uid: string;
  eventId: string;
}) => {
  const db = new FirbaseAdminClient(firestore);
  return db.updateEvent(uid, nopEvent, eventId);
};

export const postEventMessage = async (
  eventId: string,
  message: string,
  from: string
) => {
  const db = new FirbaseAdminClient(firestore);
  return db.postEventMessage(eventId, message, from);
};

export const signupToEvent = async (eventId: string, userid: string) => {
  const db = new FirbaseAdminClient(firestore);
  return db.signupToEvent(eventId, userid);
};

const EVENTS_COLLECTION = "events";
const EVENT_PARTICIPANTS = "participants";
const EVENT_SIGNUPS = "signups";
const EVENT_ATTENDES = "attendes";
const ATTENDES_ALLOWED = "allowed";
const ATTENDES_CONFIRMED = "confirmed";

class FirbaseAdminClient {
  firestore: FirebaseFirestore.Firestore;
  constructor(firestoreApp: FirebaseFirestore.Firestore) {
    this.firestore = firestoreApp;
  }
  getAllEventsFromFirestore = async (): Promise<NopEvent[]> => {
    const eventRef = this.firestore
      .collection(EVENTS_COLLECTION)
      .orderBy("order", "desc")
      .withConverter(eventConverter);
    const snapshot = await eventRef.get();

    if (snapshot.empty) {
      console.log("No events found");
      return [];
    }
    const objects: NopEvent[] = [];
    snapshot.forEach((doc) => {
      const eventDoc = doc.data();
      const options = eventDoc.options;

      if (options.active) {
        objects.push({ ...eventDoc });
      }
    });
    return objects;
  };

  getEvent = async (eventid: string): Promise<NopEvent | null> => {
    const eventRef = this.firestore
      .collection(EVENTS_COLLECTION)
      .doc(eventid)
      .withConverter(eventConverter);
    const snapshot = await eventRef.get();
    if (snapshot.exists) {
      return snapshot.data() as NopEvent;
    } else {
    }
    return null;
  };

  getEventParticipants = async (
    eventid: string
  ): Promise<EventParticipant[] | null> => {
    const eventParticipantsRef = this.firestore
      .collection(EVENTS_COLLECTION)
      .doc(eventid)
      .collection(EVENT_PARTICIPANTS)
      .withConverter(eventParticipantsConverter);

    const snapshot = await eventParticipantsRef.get();
    if (snapshot.empty) {
      console.log("No matching documents participants.");
      return null;
    }
    const particpants: EventParticipant[] = [];
    snapshot.forEach((doc) => {
      particpants.push(doc.data());
    });

    return particpants;
  };

  getMyEventStatus = async (
    iam_userid: string,
    eventid: string
  ): Promise<{ when: string } | null> => {
    //console.log("FirbaseAdminClient.getEvent for id", eventid)
    const eventStatusRef = this.firestore
      .collection(EVENTS_COLLECTION)
      .doc(eventid)
      .collection(EVENT_PARTICIPANTS)
      .doc(iam_userid);

    const snapshot = await eventStatusRef.get();
    //console.log("FirbaseAdminClient.getEvent -> snapshot", snapshot)
    if (snapshot.exists) {
      //console.log("FirbaseAdminClient.getEvent -> snapshot.data()", snapshot.data())
      return snapshot.data() as { when: string };
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("No such event!", eventid);
    }
    return null;
  };

  getEventAttendes = async (iam_userid: string, eventid: string) => {
    //events / REdvBu1tM2iI5GHEur8F / signups / attendes
    // console.log("FirbaseAdminClient.getEvent for id", eventid)
    const eventsRef = this.firestore.collection(EVENTS_COLLECTION);
    const eventRef = eventsRef.doc(eventid);
    const signupsCollectionRef = eventRef.collection("signups");
    const attendesRef = signupsCollectionRef.doc("attendes");
    const snapshot = await attendesRef.get();
    type FirebaseDocType = {
      confirmed: object[];
      allowed: string[];
    };
    if (snapshot.exists) {
      //console.log("getEventAttendes", snapshot.data())
      const dta = snapshot.data() as FirebaseDocType;
      const allowed: string[] = dta.allowed;

      // console.log("getEventAttendes.allowed:", allowed)
      if (allowed.includes(iam_userid)) {
        return dta.confirmed as ConfirmedUser[];
      } else {
        return [];
      }
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No event attendes for id ", eventid);
    }
    return [];
  };

  getEventMessages = async (iam_userid: string, eventid: string) => {
    //events / REdvBu1tM2iI5GHEur8F / signups / attendes
    // console.log("FirbaseAdminClient.getEventMessages for id", eventid)
    const eventsRef = this.firestore.collection(EVENTS_COLLECTION);
    const eventRef = eventsRef.doc(eventid);
    const signupsCollectionRef = eventRef.collection("signups");
    const attendesRef = signupsCollectionRef.doc("attendes");

    const snapshot = await attendesRef.get();
    if (snapshot.exists) {
      // console.log("getEventMessages", snapshot.data())
      const dta = snapshot.data() as {
        wallmessages: object[];
        allowed: string[];
      };
      if (dta.allowed.includes(iam_userid)) {
        if (dta.wallmessages)
          return (dta.wallmessages as EventMessage[]).reverse();
        return [];
      } else {
        return null;
      }
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No event messages for", eventid);
    }
    return [];
  };

  signupToEvent = async (eventId: string, userId: string) => {
    //console.log("signupToEvent", userid, eventId)
    // console.log("FirbaseAdminClient.signupToEvent for id", eventId, userId)
    const eventsRef = this.firestore.collection(EVENTS_COLLECTION);
    const eventRef = eventsRef.doc(eventId);
    const participantsCollectionRef = eventRef.collection(EVENT_PARTICIPANTS);
    await participantsCollectionRef
      .doc(userId)
      .set({ when: new Date().toISOString() });
  };

  postEventMessage = async (eventId: string, message: string, from: string) => {
    //console.log("firebase.postEventMessage", eventId, message, from)
    // console.log("FirbaseAdminClient.postEventMessage for id", eventId, from)
    const eventsRef = this.firestore.collection(EVENTS_COLLECTION);
    const eventRef = eventsRef.doc(eventId);
    const signupsCollectionRef = eventRef.collection("signups");
    const attendesRef = signupsCollectionRef.doc("attendes");

    const wallmessage: EventMessage = {
      from: {
        username: from,
        uid: from,
      },
      message: message,
      when: new Date().toISOString(),
    };
    await attendesRef.update({
      wallmessages: FieldValue.arrayUnion(wallmessage),
    });
  };

  getEventDocRef(
    eventsCollection: CollectionReference<FirebaseFirestore.DocumentData>,
    eventId?: string
  ) {
    if (eventId) {
      return eventsCollection.doc(eventId);
    }
    return eventsCollection.doc();
  }

  createEvent = async (
    uid: string,
    nopEvent: EventFormType
  ): Promise<string> => {
    // console.log("persist event", uid, nopEvent);
    const eventsRef = this.firestore.collection(EVENTS_COLLECTION);

    const docRef = eventsRef.doc();
    await docRef.set({ ...nopEvent, owner: uid });

    const createdEventId = docRef.id; 

    const eventAttendes = docRef.collection(EVENT_SIGNUPS).doc(EVENT_ATTENDES);
    await eventAttendes.set({allowed: []})
    await eventAttendes.set({confirmed: []})
    await this.signupToEvent(createdEventId, uid);
    await this.addUserAsAllowed(createdEventId, uid);
    return createdEventId;
  };

  addAsAttende = async (
    eventId: string,
    userId: string,
    name: string,
    username: string,
    addAsAllowed: boolean
  ): Promise<string | null> => {
    const eventsRef = this.firestore.collection(EVENTS_COLLECTION);
    const attendesRef = eventsRef
      .doc(eventId)
      .collection(EVENT_SIGNUPS)
      .doc(EVENT_ATTENDES);

    const attendesDoc = await attendesRef.get();

    if (attendesDoc.exists){
      await attendesRef.update({
        confirmed: FieldValue.arrayUnion({ id: userId, name, username }),
      });
    } else {

      await attendesRef.set({confirmed: [{ id: userId, name, username }]})
    }

    if (addAsAllowed) {
      void this.addUserAsAllowed(eventId, userId)
    }


    return null;
  };

  addUserAsAllowed = async (eventId: string, userId:string): Promise<string|null> => {
        const eventsRef = this.firestore.collection(EVENTS_COLLECTION);
    const attendesRef = eventsRef
      .doc(eventId)
      .collection(EVENT_SIGNUPS)
      .doc(EVENT_ATTENDES);

    await attendesRef.update({
      allowed: FieldValue.arrayUnion(userId),
    });

    return null;
  }

  updateEvent = async (
    uid: string,
    nopEvent: EventFormType,
    eventId: string
  ): Promise<string | null> => {
    const eventsRef = this.firestore.collection(EVENTS_COLLECTION);
    const docRef = eventsRef.doc(eventId);

    const documentSnapshot = await docRef.get();
    const event = documentSnapshot.data() as EventFirestoreModel;

    if (event.owner === uid) {
      await docRef.set({ ...nopEvent, owner: uid }, { merge: true });
      return docRef.id;
    }

    return null;
  };
}

const eventConverter: FirestoreDataConverter<NopEvent> = {
  toFirestore: (event: NopEvent): EventFirestoreModel => {
    return { ...event };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<EventFirestoreModel>
  ): NopEvent => {
    const data = snapshot.data();
    return { id: snapshot.id, ...data };
  },
};

const eventParticipantsConverter: FirestoreDataConverter<EventParticipant> = {
  toFirestore: (event: EventParticipant): DocumentData => {
    return { ...event };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot
    //options: SnapshotOptions
  ): EventParticipant => {
    const data = snapshot.data();
    return { id: snapshot.id, when: data.when };
  },
};
