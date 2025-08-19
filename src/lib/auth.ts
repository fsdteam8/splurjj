import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

interface GoogleResponseData {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
  };
}

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
    // async signIn({ user, account, profile }) {
    //   if (account?.provider === "google" || account?.provider === "facebook") {
    //     try {
    //       if (account.provider === "google") {
    //         const res = await fetch(
    //           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google/auth/jwt-process`,
    //           {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({
    //               name: profile?.name,
    //               email: profile?.email,
    //               googleAuthentication: (profile as { email_verified: boolean })
    //                 ?.email_verified,
    //             }),
    //           }
    //         );

    //         const data = await res.json();

    //         console.log({ data });

    //         if (!data?.token || !data?.user) {
    //           return false;
    //         }

    //         user.id = data.user.id;
    //         user.name = data.user.name;
    //         user.email = data.user.email;
    //         user.image = data.user.image;
    //         user.role = data.user.role;
    //         user.token = data.token;
    //       } else if (account.provider === "facebook") {
    //         const res = await fetch(
    //           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google/auth/jwt-process`,
    //           {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({
    //               name: profile?.name,
    //               email: profile?.email,
    //               googleAuthentication: true,
    //             }),
    //           }
    //         );

    //         const data = await res.json();

    //         if (!data?.token || !data?.user) {
    //           console.error(`${account.provider} login failed:`, data);
    //           return false;
    //         }

    //         user.id = data.user.id;
    //         user.name = data.user.name;
    //         user.email = data.user.email;
    //         user.image = data.user.image;
    //         user.role = data.user.role;
    //         user.token = data.token;
    //       }
    //     } catch (err) {
    //       console.error(`${account.provider} signIn error:`, err);
    //       return false;
    //     }
    //   }

    //   return true;
    // },

    // --------------------------------------------

    // async signIn({ user, account, profile }) {
    //   if (account?.provider === "google") {
    //     try {
    //       console.log("google login profile:", profile);
    //       console.log(user,account)
    //       const formData = new FormData();
    //       formData.append("name", profile?.name || "");
    //       formData.append("email", profile?.email || "");
    //       formData.append(
    //         "googleAuthentication",
    //         String(
    //           (profile as { email_verified?: boolean })?.email_verified ?? false
    //         )
    //       );

    //       const res = await fetch(
    //         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google/auth/jwt-process`,
    //         {
    //           method: "POST",
    //           body: formData,
    //         }
    //       );

    //         const data = await res.json();

    //         console.log("google response data", data);

    //         if (!data?.token || !data?.user) {
    //           return false;
    //         }

    //       // console.log(res);
    //       // // read as text first to prevent HTML parse crash
    //       // const text = await res.json();
    //       // let data;
    //       // try {
    //       //   data = JSON.parse(text);
    //       // } catch (err) {
    //       //   console.error("Google login response is not JSON:", text, err);
    //       //   return false;
    //       // }

    //       // console.log("google login data:", data);

    //       // if (!data?.token || !data?.user) {
    //       //   console.error("Google login failed:", data);
    //       //   return false;
    //       // }

    //       user.id = data.user.id;
    //       user.name = data.user.name;
    //       user.email = data.user.email;
    //       user.image = data.user.image;
    //       user.role = data.user.role;
    //       user.token = data.token;
    //     } catch (err) {
    //       console.error("Google signIn error:", err);
    //       return false;
    //     }
    //   }

    //   return true;
    // },

    // ------------------------------

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          console.log("google login profile:", profile);
          console.log("google login user/account:", user, account);

          // Send as JSON instead of FormData (more reliable)
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google/auth/jwt-process`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: profile?.name || "",
                email: profile?.email || "",
                googleAuthentication:
                  (profile as { email_verified?: boolean })?.email_verified ??
                  false,
              }),
            }
          );

          // Read raw response first (for debugging)
          const text = await res.text();
          console.log("Google backend raw response:", text);

          let data: GoogleResponseData;
          try {
            data = JSON.parse(text);
          } catch (err) {
            console.error(
              "❌ Response is not valid JSON. Check backend route.",
              err
            );
            return false;
          }

          console.log("✅ Parsed Google response data:", data);

          if (!data?.token || !data?.user) {
            console.error("❌ Google login failed: missing token/user", data);
            return false;
          }

          // Attach backend user data to NextAuth user
          user.id = data.user.id;
          user.name = data.user.name;
          user.email = data.user.email;
          user.image = data.user.image;
          user.role = data.user.role;
          user.token = data.token;
        } catch (err) {
          console.error("Google signIn error:", err);
          return false;
        }
      }

      return true;
    },

    // async signIn({ user, account, profile }) {
    //   if (account?.provider === "google" || account?.provider === "facebook") {
    //     try {
    //       const formData = new FormData();

    //       if (account.provider === "google") {
    //         formData.append("name", profile?.name || "");
    //         formData.append("email", profile?.email || "");
    //         formData.append("googleAuthentication", "true");
    //         // formData.append(
    //         //   "googleAuthentication",
    //         //   String(
    //         //     (profile as { email_verified: boolean })?.email_verified ??
    //         //       false
    //         //   )
    //         // );

    //         const res = await fetch(
    //           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google/auth/jwt-process`,
    //           {
    //             method: "POST",
    //             body: formData,
    //           }
    //         );

    //         const data = await res.json();
    //         console.log("google login data", data);

    //         if (!data?.token || !data?.user) {
    //           return false;
    //         }

    //         user.id = data.user.id;
    //         user.name = data.user.name;
    //         user.email = data.user.email;
    //         user.image = data.user.image;
    //         user.role = data.user.role;
    //         user.token = data.token;
    //       } else if (account.provider === "facebook") {
    //         formData.append("name", profile?.name || "");
    //         formData.append("email", profile?.email || "");
    //         formData.append("googleAuthentication", "true");

    //         const res = await fetch(
    //           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google/auth/jwt-process`,
    //           {
    //             method: "POST",
    //             body: formData,
    //           }
    //         );

    //         const data = await res.json();

    //         if (!data?.token || !data?.user) {
    //           console.error(`${account.provider} login failed:`, data);
    //           return false;
    //         }

    //         user.id = data.user.id;
    //         user.name = data.user.name;
    //         user.email = data.user.email;
    //         user.image = data.user.image;
    //         user.role = data.user.role;
    //         user.token = data.token;
    //       }
    //     } catch (err) {
    //       console.error(`${account.provider} signIn error:`, err);
    //       return false;
    //     }
    //   }

    //   return true;
    // },

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
