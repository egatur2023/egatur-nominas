import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import login from "resources/services/auth";

export default NextAuth ({
    secret: "soygotto",
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            
            async authorize(credentials){
                // Add logic here to look up the user from the credentials supplied
                try {
                    const user = await login({ email: credentials.email, password: credentials.password });
                    console.log(user);
                    return user;
                } catch (e) {
                    console.log(e);
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        jwt: async ({ token, user }) => {
            user && (token.user = user);
            return token;
        },
        session: async ({ session, token }) => {
            session.user = token.user;
            return session;
        },
    },
});