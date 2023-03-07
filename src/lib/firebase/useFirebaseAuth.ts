import { useState, useEffect } from "react";
import {auth} from "./firebase";
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
    if (!authState) {
      setLoading(false);
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
    signInWithEmailAndPassword(auth, email, password).then((firebaseUser) => {
      console.log("after authSignInWithEmailAndPassword:", firebaseUser);
      //firebaseUser.user.getIdTokenResult();
      console.log("signInWithEmailAndPassword.firebaseUser", firebaseUser);

    });
  };


  const signOut = () => {
    console.log("signout authuser: ", authUser);
    firbaseSignOut(auth)
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
