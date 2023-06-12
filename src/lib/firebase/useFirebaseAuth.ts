import { useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut as firbaseSignOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";



type NopUser = {
  uid: string;
  email: string | null;
}

const formatAuthUser = (user: User): NopUser => ({
  uid: user.uid,
  email: user.email,
});


export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<NopUser | null>(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = (authState: User | null): void => {
    console.log("authStateChanged", authState)

    if (!authState) {
      setLoading(false);
      setAuthUser(null)
      return;
    }

    setLoading(true);

    const formattedUser: NopUser = formatAuthUser(authState);
    console.log("authStateChanged", authState, formattedUser);
    setAuthUser(formattedUser);

    setLoading(false);
  };

  const clear = () => {
    setLoading(true);
  };

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  };


  const signOut = async () => {
    console.log("signout authuser: ", authUser);
    await firbaseSignOut(auth)
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signIn,
    signOut,
  };
}
