import { Role } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { ResultLoginUseCase } from "resources/types"

/*
    CU06 - Iniciar sesión

    Descripción
        Los administradores de centro deportivo podrán ingresar al sistema.
*/
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: ResultLoginUseCase & DefaultSession["user"]
  }

  interface User {
    id : number,
    email : string,
    role : Role
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
    user : ResultLoginUseCase
  }
}
