import { useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firbaseSignOut,
  onAuthStateChanged
} from "firebase/auth";

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState) => {
    console.log("authStateChanged", authState)

    if (!authState) {
      setLoading(false);
      setAuthUser(null)
      return;
    }

    setLoading(true);

    var formattedUser = formatAuthUser(authState);
    console.log("authStateChanged", authState, formattedUser);
    setAuthUser(formattedUser);

    setLoading(false);
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signIn = async (email, password) => {
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
