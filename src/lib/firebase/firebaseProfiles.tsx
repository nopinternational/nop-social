import { firestoreFoo } from "./firebase";
import {
    type DocumentData,
    type QueryDocumentSnapshot,
    type SnapshotOptions,
    type WithFieldValue,
    collection,
    getDocs,
} from "firebase/firestore";
import { type Profile } from "~/server/api/routers/profileRouter";

interface ProfileDbModel {
    username: string;
    person1: PersonDbModel
    person2: PersonDbModel
}
interface PersonDbModel {
    name: string;
    born: string;

}

export const getAllProfilesFromFirestore = async () => {

    const querySnapshot = await getDocs(collection(firestoreFoo, "public").withConverter(profileConverter));
    const objects: Profile[] = []
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => `, doc.data());
        objects.push(doc.data())
    });
    return objects;
};


// Firestore data converter
const profileConverter = {
    toFirestore: (profile: Profile): ProfileDbModel => {
        return {
            "username": profile.username,
            "person1": {
                "name": profile.person1.name,
                "born": profile.person1.born,
            },
            "person2": {
                "name": profile.person2.name,
                "born": profile.person2.born,
            }
        };
    },
    fromFirestore: (
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Profile => {
        const data = snapshot.data(options) as ProfileDbModel;
        return {
            "username": data.username,
            "person1": {
                "name": data.person1.name,
                "born": data.person1.born,
            },
            "person2": {
                "name": data.person2.name,
                "born": data.person2.born,
            }


        }
    }
};

