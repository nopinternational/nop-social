import { type GetServerSidePropsContext } from "next";
import {
  type NextAuthOptions,
  type DefaultSession,
  type User,
  getServerSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth as authApp } from "../lib/firebase/firebase";
import {
  browserSessionPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence
} from "firebase/auth";
import { type FirebaseError } from "firebase/app";


/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}


interface SigninUser extends User {
  subscription: string | boolean;
}
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
    signIn({ user }) {
      const signinUser = user as SigninUser;

      if (signinUser.subscription === true) { return true }
      if (signinUser.subscription !== "true")
        throw new Error("403")

      return false
    },
    redirect: async ({ url }) => {
      return Promise.resolve(url)
    }
  },
  //adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [

    CredentialsProvider({
      id: "nop-auth",
      name: "NoP Auth",
      async authorize(credentials) {
        await setPersistence(authApp, browserSessionPersistence)
        onAuthStateChanged(authApp, (user) => {
          // console.log("-------------------------------")
          // console.log("-------------------------------")
          // console.log("-------------------------------")
          // console.log("onAuthStateChanged -> user", user?.uid)
          // console.log("-------------------------------")
          // console.log("-------------------------------")
          // console.log("-------------------------------")
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            // ...
          } else {
            // User is signed out
            // ...
          }
        });
        const fbuser = await signInWithEmailAndPassword(authApp, credentials?.username || "", credentials?.password || "")
          .then(async (firebaseUser) => {

            const idTokenResult = await firebaseUser.user.getIdTokenResult()

            // .then((idTokenResult) => {


            //console.log("after authSignInWithEmailAndPassword:", firebaseUser);
            return {
              "id": firebaseUser.user.uid,
              "name": firebaseUser.user.displayName,
              "email": firebaseUser.user.email,
              "subscription": idTokenResult.claims.subscription == "true"
            }
          }, (error) => {
            const firebaseError = error as FirebaseError

            console.error("error in signInWithEmailAndPassword:", firebaseError.message);
            return null
          })


        // console.log("authorize,  returnObject:", fbuser)
        return fbuser

      },
      credentials: {
        username: { label: "Username", type: "text ", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: "/signin",
    signOut: '/signin',
    error: '/signin/error'
  },
  session: {
    strategy: "jwt",
    //maxAge: 2 * 60 * 60, // 2 hours
  },
  events: {
    signIn: () => {
      // console.log("EVENT: signin ", obj)
    },
    signOut: () => {
      // console.log("EVENT: signout ", obj)
      signOut(authApp)
        .then(() => { console.log("firebase signout OK") })
        .catch((err) => { console.log("firebase signout ERROR ", err) })

    }
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
}
