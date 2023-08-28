import { firestoreFoo } from "../../lib/firebase/firebase";
import {
    type QueryDocumentSnapshot,
    type SnapshotOptions,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    arrayUnion
} from "firebase/firestore";
import { type NopEvent, type ConfirmedUser, type EventFirestoreModel, type EventMessage } from "./components/types"

export const getAllEventsFromFirestore = async (): Promise<NopEvent[]> => {
    const querySnapshot = await getDocs(collection(firestoreFoo, "events").withConverter(eventConverter));
    const objects: NopEvent[] = []
    querySnapshot.forEach((eventDoc) => {
        objects.push(eventDoc.data())
    });

    return objects;
}

export const getEvent = async (eventid: string): Promise<NopEvent | null> => {
    const docRef = doc(firestoreFoo, "events", eventid).withConverter(eventConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!", eventid);
    }
    return null
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

export const getEventMessages = async (eventid: string) => {
    //events / REdvBu1tM2iI5GHEur8F / signups / attendes
    const docRef = doc(firestoreFoo, "events", eventid, "signups", "attendes");
    //console.log("docRef", docRef.path)
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data()
            //console.log("getEventAttendes ->data:", data)
            //console.log("getEventAttendes ->data.confirmed:", data.confirmed)
            return data.wallmessages as EventMessage[]
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

export const postEventMessage = async (eventId: string, message: string, from: string) => {
    console.log("firebase.postEventMessage", eventId, message, from)
    const docRef = doc(firestoreFoo, "events", eventId, "signups", "attendes");
    const wallmessage = {
        from: {
            username: from,
            uid: from
        },
        message: message,
        when: new Date().getUTCDate()
    }
    await updateDoc(docRef, {
        wallmessages: arrayUnion(wallmessage)
    });
}

const eventConverter = {
    toFirestore: (event: NopEvent): EventFirestoreModel => {
        return { ...event };
    },
    fromFirestore: (
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): NopEvent => {
        const data = snapshot.data(options) as EventFirestoreModel;

        return { id: snapshot.id, ...data }
    }
};
