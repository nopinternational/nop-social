import { firestoreFoo } from "./firebase";

import { collection, getDocs } from "firebase/firestore";

export const getAllProfilesFromFirestore = async () => {

    const querySnapshot = await getDocs(collection(firestoreFoo, "public"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
};


