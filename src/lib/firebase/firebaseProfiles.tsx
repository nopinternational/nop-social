import { firestoreFoo } from "./firebase";
import {
    type QueryDocumentSnapshot,
    type SnapshotOptions,
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

    const querySnapshot = await getDocs(collection(firestoreFoo, "profiles").withConverter(profileConverter));
    const objects: Profile[] = []
    querySnapshot.forEach((profiledoc) => {
        //console.log(`${profiledoc.id} => `, profiledoc.data());
        objects.push(profiledoc.data())
        //copy profile to new collection
        // const newRef = doc(firestoreFoo, "profiles", profiledoc.id)
        // setDoc(newRef, profiledoc.data())

    });

    return objects;
};

// const mv = async (collRefSource: CollectionReference<DocumentData>, collRefDest: DocumentReference) => {
//     const querySnapshot = await getDocs(collRefSource)

//     querySnapshot.forEach((docSnapshot) => {
//         (async () => {
//             const destDoc = await getDoc(collRefDest)
//             //await setDoc(destDoc, docSnapshot.id, docSnapshot.data());
//             //docSnapshot.ref.delete();
//         })();
//         const collRefs = await getDocs(docSnapshot);
//         collRefs.forEach((collRef) => {
//             mv(collRef, collRefDest.doc(docSnapshot.id).collection(collRef.id))
//         })
//     });
// };


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

