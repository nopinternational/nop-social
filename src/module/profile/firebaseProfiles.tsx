import { firestoreAdmin } from "~/server/api/firebaseAdmin";
import { type Person, type Profile } from "~/module/profile/profileRouter";
import {
    type QueryDocumentSnapshot,
    type FirestoreDataConverter,
    type DocumentData,
} from "firebase-admin/firestore";

interface ProfileDbModel extends DocumentData {
  username: string;
  person1: PersonDbModel;
  person2: PersonDbModel;
  description: string;
  avatar?: string;
}
interface PersonDbModel extends DocumentData {
  name: string;
  born: number;
}

export type PartialProfile = {
  person1?: Person;
  person2?: Person;
  description?: string;
};

export const getAllProfilesFromFirestore = async (): Promise<Profile[]> => {
    const profilesRef = firestoreAdmin
        .collection("profiles")
        .withConverter(profileConverter);

    const objects: Profile[] = [];

    const query = await profilesRef.get();
    query.docs.forEach((snapshot) => objects.push(snapshot.data()));

    return objects;
};

export const getProfileByIdFromFirestore = async (
    profileid: string
): Promise<Profile | null> => {
    const profileRef = firestoreAdmin
        .collection("profiles")
        .doc(profileid)
        .withConverter(profileConverter);


    const doc = await profileRef.get();
    if (!doc.exists) {
        //console.log("Profile does not exist ", profileid);
    } else {
        // console.log("Document data:", doc.data());
        return doc.data() as Profile;
    }

    return null;

};

export const getProfileByProfileNameFromFirestore = async (
    profileid: string
): Promise<Profile | null> => {
    const profilesRef = firestoreAdmin
        .collection("profiles")
        .withConverter(profileConverter);

    const queryRef = profilesRef.where("username", "==", profileid);

    const querySnapshot = await queryRef.get();

    if (querySnapshot.docs.length > 0) {
        const profile = querySnapshot.docs[0]?.data();
        //console.log("getProfileFromFirestore", profile);
        return Promise.resolve(profile as Profile);
    }

    console.error(
        "getProfileFromFirestore, found nothing for profileid",
        profileid
    );
    return null;
};

export const getProfileByUserIdFromFirestore = async (
    userId: string
): Promise<Profile | null> => {
    const profilesRef = firestoreAdmin
        .collection("profiles")
        .doc(userId)
        .withConverter(profileConverter);

    // const queryRef = profilesRef.where("username", "==", profileid);

    const profileSnapshot = await profilesRef.get();

    if (profileSnapshot.exists) {
        const d = profileSnapshot.data() as Profile;
        // console.log("get user for id", userId, d);
        d.id = userId;
        return d;
    }

    return null;
};

export const mergeToProfile = async (
    id: string,
    partialProfile: PartialProfile
) => {
    //console.log("mergeToProfile.partialProfile", id, partialProfile)
    const profileRef = firestoreAdmin.collection("profiles").doc(id);

    await profileRef.set(partialProfile, { merge: true });
    //---
    //await setDoc(doc(firestoreFoo, "profiles", id), partialProfile, { merge: true })
};

// export const mergeToProfile = async (id: string, partialProfile: PartialProfile) => {
//     //console.log("mergeToProfile.partialProfile", id, partialProfile)

//     await setDoc(doc(firestoreFoo, "profiles", id), partialProfile, { merge: true })
// }

// export const setPersonToProfile = async (id: string, person: Person) => {
//     //console.log("setPersonToProfile.person", id, person);
//     await setDoc(doc(firestoreFoo, "profiles", id), person, { merge: true })
// }

// export const getAllProfilesFromFirestore = async () => {

//     const querySnapshot = await getDocs(collection(firestoreFoo, "profiles").withConverter(profileConverter));
//     const objects: Profile[] = []
//     querySnapshot.forEach((profiledoc) => {
//         //console.log(`${profiledoc.id} => `, profiledoc.data());
//         objects.push(profiledoc.data())
//         //copy profile to new collection
//         // const newRef = doc(firestoreFoo, "profiles", profiledoc.id)
//         // setDoc(newRef, profiledoc.data())

//     });

//     return objects;
// };

// export const mergeToProfile = async (id: string, partialProfile: PartialProfile) => {
//     //console.log("mergeToProfile.partialProfile", id, partialProfile)
//     await setDoc(doc(firestoreFoo, "profiles", id), partialProfile, { merge: true })
// }

// export const getProfileFromFirestore = async (profileid: string): Promise<Profile | null> => {
//     // console.log("getProfileFromFirestore.profileid", profileid);
//     // const query = await getDocs(collection(firestoreFoo, "profiles").withConverter(profileConverter));
//     // query = query.where('username', '==', profileid);

//     const q = query(collection(firestoreFoo, "profiles").withConverter(profileConverter), where("username", "==", profileid));

//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.docs.length > 0) {
//         const profile = querySnapshot.docs[0]?.data()
//         //console.log("getProfileFromFirestore", profile);
//         return Promise.resolve(profile as Profile);
//     }

//     console.error("getProfileFromFirestore, found nothing for profileid", profileid);
//     return null
// }

// Firestore data converter
const profileConverter: FirestoreDataConverter<Profile> = {
    toFirestore: (profile: Profile): ProfileDbModel => {
        return {
            username: profile.username,
            person1: {
                name: profile.person1.name,
                born: profile.person1.born,
            },
            person2: {
                name: profile.person2.name,
                born: profile.person2.born,
            },
            description: profile.description,
            avatar: profile.avatar,
        };
    },
    fromFirestore: (
        snapshot: QueryDocumentSnapshot<ProfileDbModel>
    //options: SnapshotOptions
    ): Profile => {
    // const data = snapshot.data(options) as ProfileDbModel;
        const data = snapshot.data();
        let avatar = data.avatar;
        if (avatar) {
            avatar = "/api" + avatar;
        }
        return {
            id: snapshot.id,
            username: data.username,
            person1: {
                name: data.person1.name,
                born: data.person1.born,
            },
            person2: {
                name: data.person2.name,
                born: data.person2.born,
            },
            description: data.description,
            avatar: avatar,
        };
    },
};
