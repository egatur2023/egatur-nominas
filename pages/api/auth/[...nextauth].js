import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import login from "resources/services/auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth ({
    secret: "soygotto",
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: "258258017705-dr6a45t8g5oa4peshg6r01f347kqlvvp.apps.googleusercontent.com",
            clientSecret: "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"
          })
    ],

    callbacks: {
        // jwt: async ({ token, user }) => {
        //     user && (token.user = user);
        //     return token;
        // },
        // session: async ({ session, token }) => {
        //     session.user = token.user;
        //     return session;
        // },
    },
    newUser: '/app/dashboard'
});
