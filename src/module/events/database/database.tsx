import { firestoreAdmin } from "~/server/api/firebaseAdmin";
import {
  type NopEvent,
  type EventParticipant,
} from "../components/types";
import { FirbaseAdminClient } from "./eventsFirebase";
import { type EventFormType } from "../components/NoPEventForm";
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
