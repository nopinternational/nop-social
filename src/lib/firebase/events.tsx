import { firestoreFoo } from "./firebase";
import {
    type QueryDocumentSnapshot,
    type SnapshotOptions,
    collection,
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

type Event = {
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
