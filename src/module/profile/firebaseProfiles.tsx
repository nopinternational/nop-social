import { firestoreFoo } from "../../lib/firebase/firebase";
import {
    type QueryDocumentSnapshot,
    type SnapshotOptions,
    collection,
    getDocs,
    setDoc,
    query,
    where,
    doc,
} from "firebase/firestore";
import {
    type Person,
    type Profile
} from "~/module/profile/profileRouter";

interface ProfileDbModel {
    username: string;
    person1: PersonDbModel
    person2: PersonDbModel
    description: string
}
interface PersonDbModel {
    name: string;
    born: number;
}

export type PartialProfile = {
    person1?: Person,
    person2?: Person,
    description?: string
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

export const setPersonToProfile = async (id: string, person: Person) => {
    //console.log("setPersonToProfile.person", id, person);
    await setDoc(doc(firestoreFoo, "profiles", id), person, { merge: true })
}


export const mergeToProfile = async (id: string, partialProfile: PartialProfile) => {
    //console.log("mergeToProfile.partialProfile", id, partialProfile)
    await setDoc(doc(firestoreFoo, "profiles", id), partialProfile, { merge: true })
}

export const getProfileFromFirestore = async (profileid: string): Promise<Profile | null> => {
    // console.log("getProfileFromFirestore.profileid", profileid);
    // const query = await getDocs(collection(firestoreFoo, "profiles").withConverter(profileConverter));
    // query = query.where('username', '==', profileid);

    const q = query(collection(firestoreFoo, "profiles").withConverter(profileConverter), where("username", "==", profileid));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
        const profile = querySnapshot.docs[0]?.data()
        //console.log("getProfileFromFirestore", profile);
        return Promise.resolve(profile as Profile);
    }



    console.error("getProfileFromFirestore, found nothing for profileid", profileid);
    return null
}




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
            },
            "description": profile.description
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
            },
            "description": data.description
        }
    }
};
