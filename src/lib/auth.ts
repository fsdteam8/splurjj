import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours in seconds
    updateAge: 36 * 60 * 60, // 36 hours in seconds
  },
  providers: [
    // ✅ Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ✅ Facebook Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok || !data?.token) {
            throw new Error(data.message || "Invalid credentials");
          }

          return {
            id: data.user.id.toString(),
            email: data.user.email,
            role: data.user.role,
            token: data.token,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          if (account.provider === "google") {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/third-party/jwt-process`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: profile?.name,
                  email: profile?.email,
                  // googleAuthentication: profile?.email_verified ,
                  googleAuthentication: (profile as { email_verified: boolean })
                    ?.email_verified,
                }),
              }
            );

            const data = await res.json();

            console.log({ data });

            if (!data?.token || !data?.user) {
              return false;
            }

            user.id = data.user.id;
            user.name = data.user.name;
            user.email = data.user.email;
            user.image = data.user.image;
            user.role = data.user.role;
            user.token = data.token;
          } else if (account.provider === "facebook") {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/third-party/jwt-process`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: profile?.name,
                  email: profile?.email,
                  googleAuthentication: true,
                }),
              }
            );

            const data = await res.json();

            if (!data?.token || !data?.user) {
              console.error(`${account.provider} login failed:`, data);
              return false;
            }

            user.id = data.user.id;
            user.name = data.user.name;
            user.email = data.user.email;
            user.image = data.user.image;
            user.role = data.user.role;
            user.token = data.token;
          }
        } catch (err) {
          console.error(`${account.provider} signIn error:`, err);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? "";
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        role: token.role as string,
        token: token.accessToken as string,
      };
      return session;
    },
  },
};
