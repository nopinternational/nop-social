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
    arrayUnion,
    FieldValue
} from "firebase-admin/firestore";
import { type NopEvent, type ConfirmedUser, type EventFirestoreModel, type EventMessage } from "./components/types"
import { type CollectionReference } from "firebase/firestore";



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

export const getEventAttendes = async (eventid: string) => {
    const db = new FirbaseAdminClient(firestore)
    return await db.getEventAttendes(eventid);
}

export const getEventMessages = async (eventid: string) => {
    const db = new FirbaseAdminClient(firestore)
    return db.getEventMessages(eventid)
}
export const postEventMessage = async (eventId: string, message: string, from: string) => {
    const db = new FirbaseAdminClient(firestore)
    console.log("postEventMessage", eventId, message, from)
    return db.postEventMessage(eventId, message, from)
}

export const signupToEvent = async (eventId: string, userid: string) => {
    const db = new FirbaseAdminClient(firestore)
    return db.signupToEvent(eventId, userid)
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
        const eventRef: CollectionReference = this.firestore
            .collection("events")
            .doc(eventid)
            .withConverter(eventConverter);
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
    getEventAttendes = async (eventid: string) => {

        //events / REdvBu1tM2iI5GHEur8F / signups / attendes
        console.log("FirbaseAdminClient.getEvent for id", eventid)
        const eventsRef: CollectionReference = this.firestore.collection("events")
        const eventRef = eventsRef.doc(eventid)
        const signupsCollectionRef = eventRef.collection("signups")
        const attendesRef = signupsCollectionRef.doc("attendes")
        attendesRef.withConverter(eventConverter);
        const snapshot = await attendesRef.get();
        if (!snapshot.empty) {
            console.log("getEventAttendes", snapshot.data())
            return snapshot.data().confirmed as ConfirmedUser[]
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!", eventid);
        }
        return []
    }

    getEventMessages = async (eventid: string) => {
        //events / REdvBu1tM2iI5GHEur8F / signups / attendes
        console.log("FirbaseAdminClient.getEventMessages for id", eventid)
        const eventsRef: CollectionReference = this.firestore.collection("events")
        const eventRef = eventsRef.doc(eventid)
        const signupsCollectionRef = eventRef.collection("signups")
        const attendesRef = signupsCollectionRef.doc("attendes")

        const snapshot = await attendesRef.get();
        if (!snapshot.empty) {
            console.log("getEventMessages", snapshot.data())
            return (snapshot.data().wallmessages as EventMessage[]).reverse()
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!", eventid);
        }
        return []


        // const docRef = doc(firestore, "events", eventid, "signups", "attendes");
        // //console.log("docRef", docRef.path)
        // try {
        //     const docSnap = await getDoc(docRef);
        //     if (docSnap.exists()) {
        //         const data = docSnap.data()
        //         //console.log("getEventAttendes ->data:", data)
        //         //console.log("getEventAttendes ->data.confirmed:", data.confirmed)
        //         return (data.wallmessages as EventMessage[]).reverse()
        //     } else {
        //         // docSnap.data() will be undefined in this case
        //         console.log("No such document!", eventid);
        //     }
        // } catch (err) {
        //     console.error("err", err)

        // }
        // return []
    }

    signupToEvent = async (eventId: string, userid: string) => {
        //console.log("signupToEvent", userid, eventId)
        console.log("FirbaseAdminClient.signupToEvent for id", eventid, userid)
        const eventsRef: CollectionReference = this.firestore.collection("events")
        const eventRef = eventsRef.doc(eventid)
        const participantsCollectionRef = eventRef.collection("participants")
        await participantsCollectionRef.doc(userid).set({ when: new Date().toISOString() })

        //await setDoc(doc(firestore, "events", eventId, "participants", userid), { when: new Date().toISOString() },)
    }

    postEventMessage = async (eventId: string, message: string, from: string) => {
        //console.log("firebase.postEventMessage", eventId, message, from)
        console.log("FirbaseAdminClient.postEventMessage for id", eventId, from)
        const eventsRef: CollectionReference = this.firestore.collection("events")
        const eventRef = eventsRef.doc(eventId)
        const signupsCollectionRef = eventRef.collection("signups")
        const attendesRef = signupsCollectionRef.doc("attendes")

        const wallmessage: EventMessage = {
            from: {
                username: from,
                uid: from
            },
            message: message,
            when: new Date().toISOString()
        }
        const korv = await attendesRef.update({
            wallmessages: FieldValue.arrayUnion(wallmessage)
        })

        console.log("korv:", korv)

        // const docRef = doc(firestore, "events", eventId, "signups", "attendes");
        // const wallmessage: EventMessage = {
        //     from: {
        //         username: from,
        //         uid: from
        //     },
        //     message: message,
        //     when: new Date().toISOString()
        // }
        // await updateDoc(docRef, {
        //     wallmessages: arrayUnion(wallmessage)
        // });
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


    getEventAttendes = async (eventid: string) => {
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

    getEventMessages = async (eventid: string) => {
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

    signupToEvent = async (eventId: string, userid: string) => {
        //console.log("signupToEvent", userid, eventId)
        await setDoc(doc(firestore, "events", eventId, "participants", userid), { when: new Date().toISOString() },)
    }

    postEventMessage = async (eventId: string, message: string, from: string) => {
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
