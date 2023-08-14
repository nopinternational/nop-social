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
        //console.log(`${profiledoc.id} => `, profiledoc.data());
        objects.push(eventDoc.data())
        //copy profile to new collection
        // const newRef = doc(firestoreFoo, "profiles", profiledoc.id)
        // setDoc(newRef, profiledoc.data())

    });

    return objects;
}

type Event = {
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
        return { ...data }
    }
};
