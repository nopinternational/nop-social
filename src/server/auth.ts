import { type GetServerSidePropsContext } from "next";
import {
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../env.mjs";
import { prisma } from "./db";
import { auth as authApp } from "../lib/firebase/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { use } from "react";
import { getSession } from "next-auth/react";

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

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user && user) {

        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
    signIn(signinOpts) {
      console.log("callbacks.signIn.signinOpts", signinOpts)
      console.log("typeof", typeof signinOpts.user.subscription)
      console.log("!= \"true\"", signinOpts.user.subscription == "true")
      console.log("!== \"true\"", signinOpts.user.subscription === "true")
      console.log("!= true", signinOpts.user.subscription == true)
      console.log("!== true", signinOpts.user.subscription === true)


      if (signinOpts.user.subscription === true) { return true }
      if (signinOpts.user.subscription !== "true")
        throw new Error("403")

      return false
    }
  },
  //adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // ...add more providers here
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: {
          label: "Name",
          type: "text",
          placeholder: "Enter your name",
        },
      },
      async authorize(credentials, _req) {
        const user = { id: 1, name: credentials?.name ?? "J Smith" };
        return user;
      },
    }),
    CredentialsProvider({
      id: "nop-auth",
      name: "NoP Auth",
      async authorize(credentials, req) {

        const fbuser = await signInWithEmailAndPassword(authApp, credentials?.username || "", credentials?.password || "")
          .then(async (firebaseUser) => {

            const idTokenResult = await firebaseUser.user.getIdTokenResult()
            console.log("============================================================")
            console.log("============================================================")
            console.log("idTokenResult.claims.subscription", idTokenResult.claims.subscription)
            console.log("------------------------------------")
            console.log("------------------------------------")
            // .then((idTokenResult) => {


            //   // Confirm the user is an Admin.
            if (idTokenResult.claims.subscriptionEEE != "true") {
              // Show admin UI.
              // console.error("upsi")
              // throw new Error("this is bad...")
            }
            //     // Show regular user UI.
            //   }
            //   console.error("upsi")
            //   throw new Error("this is bad...")
            // })
            // .catch((error) => {
            //   console.log(error);
            //   throw error
            // });


            //console.log("after authSignInWithEmailAndPassword:", firebaseUser);
            return {
              "id": firebaseUser.user.uid,
              "name": firebaseUser.user.displayName,
              "email": firebaseUser.user.email,
              "subscription": idTokenResult.claims.subscription == "true"
            }
          }, (error) => {

            console.error("error in signInWithEmailAndPassword:", error);
            return null
          })


        console.log("authorize,  returnObject:", fbuser)
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
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
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
  return getSession({ req: ctx.req });
};
