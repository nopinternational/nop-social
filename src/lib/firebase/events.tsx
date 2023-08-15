import { firestoreFoo } from "./firebase";
import {
    type QueryDocumentSnapshot,
    type SnapshotOptions,
    collection,
    doc,
    getDoc,
    getDocs,
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
