/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { firestoreFoo } from "../../lib/firebase/firebase";
import { firestoreAdmin } from "~/server/api/firebaseAdmin";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    arrayUnion,

} from "firebase/firestore";
import {
    type QueryDocumentSnapshot,
} from "firebase-admin/firestore";

import { type NopEvent, type ConfirmedUser, type EventFirestoreModel, type EventMessage } from "./components/types"
import { type CollectionReference, type FirestoreDataConverter, FieldValue } from "firebase-admin/firestore";



// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unnecessary-type-assertion
const firestore: FirebaseFirestore.Firestore = firestoreAdmin as FirebaseFirestore.Firestore;


export const getAllEventsFromFirestore = async (): Promise<NopEvent[]> => {
    const db = new FirbaseAdminClient(firestore)
    return await db.getAllEventsFromFirestore();
}
export const getEvent = async (eventid: string): Promise<NopEvent | null> => {
    const db = new FirbaseAdminClient(firestore)
    return await db.getEvent(eventid);
}

export const getEventAttendes = async (iam_userid: string, eventid: string) => {
    const db = new FirbaseAdminClient(firestore)
    return await db.getEventAttendes(iam_userid, eventid);
}

export const getEventMessages = async (eventid: string) => {
    const db = new FirbaseAdminClient(firestore)
    return db.getEventMessages(eventid)
}
export const postEventMessage = async (eventId: string, message: string, from: string) => {
    const db = new FirbaseAdminClient(firestore)
    return db.postEventMessage(eventId, message, from)
}

export const signupToEvent = async (eventId: string, userid: string) => {
    const db = new FirbaseAdminClient(firestore)
    return db.signupToEvent(eventId, userid)
}

class FirbaseAdminClient {

    firestore: FirebaseFirestore.Firestore;
    constructor(firestoreApp: FirebaseFirestore.Firestore) {
        this.firestore = firestoreApp;
    }
    getAllEventsFromFirestore = async (): Promise<NopEvent[]> => {
        // console.log("FirbaseAdminClient.getAllEventsFromFirestore")
        const eventRef = this.firestore.collection("events").withConverter(eventConverter);
        const snapshot = await eventRef.get();

        if (snapshot.empty) {
            console.log('No events found');
            return [];
        }
        const objects: NopEvent[] = []
        snapshot.forEach(doc => {

            objects.push({ ...doc.data() })
        });
        //const querySnapshot = await getDocs(collection(this.firestore, "events").withConverter(eventConverter));

        // querySnapshot.forEach((eventDoc) => {
        //     console.log("getAllEventsFromFirestore", eventDoc)
        //     objects.push(eventDoc.data())
        // });
        // console.log("FirbaseAdminClient.getAllEventsFromFirestore:", objects)
        return objects;
    }

    getEvent = async (eventid: string): Promise<NopEvent | null> => {
        //console.log("FirbaseAdminClient.getEvent for id", eventid)
        const eventRef = this.firestore
            .collection("events")
            .doc(eventid)
            .withConverter(eventConverter);
        const snapshot = await eventRef.get();
        //console.log("FirbaseAdminClient.getEvent -> snapshot", snapshot)
        if (snapshot.exists) {
            //console.log("FirbaseAdminClient.getEvent -> snapshot.data()", snapshot.data())
            return snapshot.data() as NopEvent
        } else {
            // docSnap.data() will be undefined in this case
            // console.log("No such event!", eventid);
        }
        return null
    }

    getEventAttendes = async (iam_userid: string, eventid: string) => {
        //events / REdvBu1tM2iI5GHEur8F / signups / attendes
        // console.log("FirbaseAdminClient.getEvent for id", eventid)
        const eventsRef = this.firestore.collection("events")
        const eventRef = eventsRef.doc(eventid)
        const signupsCollectionRef = eventRef.collection("signups")
        const attendesRef = signupsCollectionRef.doc("attendes")
        const snapshot = await attendesRef.get();
        type FirebaseDocType = {
            confirmed: object[]
            allowed: string[]
        }
        if (snapshot.exists) {
            //console.log("getEventAttendes", snapshot.data())
            const dta = snapshot.data() as FirebaseDocType
            const allowed: string[] = dta.allowed

            console.log("getEventAttendes.allowed:", allowed)
            if (allowed.includes(iam_userid)) {
                return dta.confirmed as ConfirmedUser[]
            } else {
                return []
            }
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No event attendes for id ", eventid);
        }
        return []
    }

    getEventMessages = async (eventid: string) => {
        //events / REdvBu1tM2iI5GHEur8F / signups / attendes
        // console.log("FirbaseAdminClient.getEventMessages for id", eventid)
        const eventsRef = this.firestore.collection("events")
        const eventRef = eventsRef.doc(eventid)
        const signupsCollectionRef = eventRef.collection("signups")
        const attendesRef = signupsCollectionRef.doc("attendes")

        const snapshot = await attendesRef.get();
        if (snapshot.exists) {
            // console.log("getEventMessages", snapshot.data())
            const dta = snapshot.data() as { wallmessages: object[] }
            return (dta.wallmessages as EventMessage[]).reverse()
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No event messages for", eventid);
        }
        return []
    }

    signupToEvent = async (eventId: string, userId: string) => {
        //console.log("signupToEvent", userid, eventId)
        // console.log("FirbaseAdminClient.signupToEvent for id", eventId, userId)
        const eventsRef = this.firestore.collection("events")
        const eventRef = eventsRef.doc(eventId)
        const participantsCollectionRef = eventRef.collection("participants")
        await participantsCollectionRef.doc(userId).set({ when: new Date().toISOString() })
    }

    postEventMessage = async (eventId: string, message: string, from: string) => {
        //console.log("firebase.postEventMessage", eventId, message, from)
        // console.log("FirbaseAdminClient.postEventMessage for id", eventId, from)
        const eventsRef = this.firestore.collection("events")
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
        await attendesRef.update({
            wallmessages: FieldValue.arrayUnion(wallmessage)
        })


    }
}

// class FirbaseClient {
//     firestore;
//     constructor(firestoreApp: any) {
//         this.firestore = firestoreApp
//     }
//     getAllEventsFromFirestore = async (): Promise<NopEvent[]> => {
//         const querySnapshot = await getDocs(collection(this.firestore, "events").withConverter(eventConverter));
//         const objects: NopEvent[] = []
//         querySnapshot.forEach((eventDoc: { data: () => { id: string; name: string; title: string; description: string; longDesc: string; when: string; }; }) => {
//             console.log("getAllEventsFromFirestore", eventDoc)
//             objects.push(eventDoc.data())
//         });

//         return objects;
//     }

//     getEvent = async (eventid: string): Promise<NopEvent | null> => {
//         const docRef = doc(firestore, "events", eventid).withConverter(eventConverter);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//             return docSnap.data()
//         } else {
//             // docSnap.data() will be undefined in this case
//             console.log("No such document!", eventid);
//         }
//         return null
//     }


//     getEventAttendes = async (eventid: string) => {
//         //events / REdvBu1tM2iI5GHEur8F / signups / attendes
//         const docRef = doc(firestore, "events", eventid, "signups", "attendes");
//         //console.log("docRef", docRef.path)
//         try {
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//                 const data = docSnap.data()
//                 //console.log("getEventAttendes ->data:", data)
//                 //console.log("getEventAttendes ->data.confirmed:", data.confirmed)
//                 return data.confirmed as ConfirmedUser[]
//             } else {
//                 // docSnap.data() will be undefined in this case
//                 console.log("No such document!", eventid);
//             }
//         } catch (err) {
//             console.error("err", err)

//         }
//         return []
//     }

//     getEventMessages = async (eventid: string) => {
//         //events / REdvBu1tM2iI5GHEur8F / signups / attendes
//         const docRef = doc(firestore, "events", eventid, "signups", "attendes");
//         //console.log("docRef", docRef.path)
//         try {
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//                 const data = docSnap.data()
//                 //console.log("getEventAttendes ->data:", data)
//                 //console.log("getEventAttendes ->data.confirmed:", data.confirmed)
//                 return (data.wallmessages as EventMessage[]).reverse()
//             } else {
//                 // docSnap.data() will be undefined in this case
//                 console.log("No such document!", eventid);
//             }
//         } catch (err) {
//             console.error("err", err)

//         }
//         return []
//     }

//     signupToEvent = async (eventId: string, userid: string) => {
//         //console.log("signupToEvent", userid, eventId)
//         await setDoc(doc(firestore, "events", eventId, "participants", userid), { when: new Date().toISOString() },)
//     }

//     postEventMessage = async (eventId: string, message: string, from: string) => {
//         //console.log("firebase.postEventMessage", eventId, message, from)
//         const docRef = doc(firestore, "events", eventId, "signups", "attendes");
//         const wallmessage: EventMessage = {
//             from: {
//                 username: from,
//                 uid: from
//             },
//             message: message,
//             when: new Date().toISOString()
//         }
//         await updateDoc(docRef, {
//             wallmessages: arrayUnion(wallmessage)
//         });
//     }
// }


const eventConverter: FirestoreDataConverter<NopEvent> = {
    toFirestore: (event: NopEvent): EventFirestoreModel => {
        return { ...event };
    },
    fromFirestore: (
        snapshot: QueryDocumentSnapshot<EventFirestoreModel>,
        //options: SnapshotOptions
    ): NopEvent => {
        const data = snapshot.data();

        return { id: snapshot.id, ...data }
    }
};
