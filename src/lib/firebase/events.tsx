import { firestoreFoo } from "./firebase";
import {
    type QueryDocumentSnapshot,
    type SnapshotOptions,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc
} from "firebase/firestore";

export const getAllEventsFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(firestoreFoo, "events").withConverter(eventConverter));
    const objects: Event[] = []
    querySnapshot.forEach((eventDoc) => {
        objects.push(eventDoc.data())
    });

    return objects;
}

export const getEvent = async (eventid: string) => {
    const docRef = doc(firestoreFoo, "events", eventid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!", eventid);
    }
}

type ConfirmedUser = {
    name: string,
    id: string
}

export const getEventAttendes = async (eventid: string) => {
    //events / REdvBu1tM2iI5GHEur8F / signups / attendes
    const docRef = doc(firestoreFoo, "events", eventid, "signups", "attendes");
    //console.log("docRef", docRef.path)
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data()
            //console.log("getEventAttendes ->data:", data)
            //console.log("getEventAttendes ->data.confirmed:", data.confirmed)
            return data.confirmed as ConfirmedUser[]
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!", eventid);
        }
    } catch (err) {
        console.error("err", err)

    }
    return []
}

export const signupToEvent = async (userid: string, eventId: string) => {
    //console.log("signupToEvent", userid, eventId)
    await setDoc(doc(firestoreFoo, "events", eventId, "participants", userid), { when: new Date().toISOString() },)
}

export type Event = {
    id: string
    name: string,
    title: string,
    description: string
}

type EventFirestoreModel = {
    name: string,
    title: string,
    description: string
}
const eventConverter = {
    toFirestore: (event: Event): EventFirestoreModel => {
        return { ...event };
    },
    fromFirestore: (
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Event => {
        const data = snapshot.data(options) as EventFirestoreModel;

        return { id: snapshot.id, ...data }
    }
};
