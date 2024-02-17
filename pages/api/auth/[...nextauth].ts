import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import loginUseCase from "resources/services/login.use.case";


export default NextAuth ({
    secret: "soygotto",
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: "155916180607-9pemeq933ocd5u6r0mv4c32u4k4r17ta.apps.googleusercontent.com",
            clientSecret: "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"
            // clientId: "258258017705-dr6a45t8g5oa4peshg6r01f347kqlvvp.apps.googleusercontent.com",
            // clientSecret: "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"
          })
    ],
    callbacks: {
        jwt: async (params) => {
            const { token , user} = params
            //@ts-ignore
            user && (token.user = user)
            return token
        },
        session: async (params) => {
            const { session, token } = params
            //@ts-ignore
            session.user = token.user
            const userAuthenticated = await loginUseCase({ email : String(session?.user?.email) })

            if(userAuthenticated && session.user != undefined && session.user != null){
                session.user = userAuthenticated
                // session.user.role = userAuthenticated.role
            }
            return session
        },
        async signIn(params) {
            const { account, profile } = params
            if (account && profile && account.provider === "google" ) {
                const user = await loginUseCase({ email : String(profile?.email) })
                return user && user.email === String(profile?.email) ? true : false
            }
            return false
        },
    },
});
