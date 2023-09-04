import { firestoreFoo } from "../../lib/firebase/firebase";
import { firestoreAdmin } from "~/server/api/firebaseAdmin";
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
} from "firebase-admin/firestore";
import { type NopEvent, type ConfirmedUser, type EventFirestoreModel, type EventMessage } from "./components/types"
import { CollectionReference } from "firebase/firestore";



// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const firestore: FirebaseFirestore.Firestore = firestoreAdmin as FirebaseFirestore.Firestore;


export const getAllEventsFromFirestore = async (): Promise<NopEvent[]> => {
    const db = new FirbaseAdminClient(firestore)
    return await db.getAllEventsFromFirestore();
}
export const getEvent = async (eventid: string): Promise<NopEvent | null> => {
    const db = new FirbaseAdminClient(firestore)
    return await db.getEvent(eventid);
}
class FirbaseAdminClient {

    firestore: FirebaseFirestore.Firestore;
    constructor(firestoreApp: Firestore) {
        this.firestore = firestoreApp;
    }
    getAllEventsFromFirestore = async (): Promise<NopEvent[]> => {
        console.log("FirbaseAdminClient.getAllEventsFromFirestore")
        const eventRef: CollectionReference = this.firestore.collection("events").withConverter(eventConverter);
        const snapshot = await eventRef.get();

        if (snapshot.empty) {
            console.log('No matching documents.');
            return [];
        }
        const objects: NopEvent[] = []
        snapshot.forEach(doc => {
            objects.push({ id: doc.id, ...doc.data() })
        });
        //const querySnapshot = await getDocs(collection(this.firestore, "events").withConverter(eventConverter));

        // querySnapshot.forEach((eventDoc) => {
        //     console.log("getAllEventsFromFirestore", eventDoc)
        //     objects.push(eventDoc.data())
        // });
        console.log("FirbaseAdminClient.getAllEventsFromFirestore:", objects)
        return objects;
    }

    getEvent = async (eventid: string): Promise<NopEvent | null> => {
        console.log("FirbaseAdminClient.getEvent for id", eventid)
        const eventRef: CollectionReference = this.firestore.collection("events").doc(eventid).withConverter(eventConverter);
        const snapshot = await eventRef.get();
        if (!snapshot.empty) {
            return snapshot.data()
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!", eventid);
        }
        return null

        // const docRef = doc(firestore, "events", eventid).withConverter(eventConverter);
        // const docSnap = await getDoc(docRef);
        // if (docSnap.exists()) {
        //     return docSnap.data()
        // } else {
        //     // docSnap.data() will be undefined in this case
        //     console.log("No such document!", eventid);
        // }
        // return null
    }
}

class FirbaseClient {
    constructor(firestoreApp) {
        this.firestore = firestoreApp
    }
    getAllEventsFromFirestore = async (): Promise<NopEvent[]> => {
        const querySnapshot = await getDocs(collection(this.firestore, "events").withConverter(eventConverter));
        const objects: NopEvent[] = []
        querySnapshot.forEach((eventDoc) => {
            console.log("getAllEventsFromFirestore", eventDoc)
            objects.push(eventDoc.data())
        });

        return objects;
    }

    getEvent = async (eventid: string): Promise<NopEvent | null> => {
        const docRef = doc(firestore, "events", eventid).withConverter(eventConverter);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!", eventid);
        }
        return null
    }

}
export const getEventAttendes = async (eventid: string) => {
    //events / REdvBu1tM2iI5GHEur8F / signups / attendes
    const docRef = doc(firestore, "events", eventid, "signups", "attendes");
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
    const docRef = doc(firestore, "events", eventid, "signups", "attendes");
    //console.log("docRef", docRef.path)
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data()
            //console.log("getEventAttendes ->data:", data)
            //console.log("getEventAttendes ->data.confirmed:", data.confirmed)
            return (data.wallmessages as EventMessage[]).reverse()
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
    await setDoc(doc(firestore, "events", eventId, "participants", userid), { when: new Date().toISOString() },)
}

export const postEventMessage = async (eventId: string, message: string, from: string) => {
    //console.log("firebase.postEventMessage", eventId, message, from)
    const docRef = doc(firestore, "events", eventId, "signups", "attendes");
    const wallmessage: EventMessage = {
        from: {
            username: from,
            uid: from
        },
        message: message,
        when: new Date().toISOString()
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
