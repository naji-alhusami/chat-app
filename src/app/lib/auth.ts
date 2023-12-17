import { db } from "@/app/lib/db";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { fetchRadis } from "../herlpers/redis";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing google client id");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing google client secret");
  }

  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db), // everytime user login with google (ex), this helps in connecting to db
  session: {
    strategy: "jwt", // handle the session on json web token, helps us verify the session in middleware
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // calbacks are actions that are taken when certain events happen that next-auth detects
    async jwt({ token, user }) {
      //The jwt callback is called whenever a JSON Web Token (JWT) is created or updated.
      const dbUserResult = (await fetchRadis("get", `user:${token.id}`)) as
        | string
        | null;

      if (!dbUserResult) {
        // if the user is new (not found in db)
        token.id = user!.id; // this ! for TS to tell TS that we know that there is user and we are sure
        return token;
      }

      const dbUser = JSON.parse(dbUserResult) as User;

      return {
        id: dbUser.id, // the first id for token
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      // update session
      if (token) {
        // if we have token , we want to use token values in our app, we need to set them to our session values
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};
