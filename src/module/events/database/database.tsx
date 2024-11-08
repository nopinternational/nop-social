import { firestoreAdmin } from "~/server/api/firebaseAdmin";
import {
  type NopEvent,
  type EventParticipant,
} from "../components/types";
import { FirbaseAdminClient } from "./eventsFirebase";
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
