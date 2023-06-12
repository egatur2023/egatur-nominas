import { prisma } from '../../prisma/db'

export default async function login( { email , password } : {email : string , password : string})  {
    return await prisma.user.findFirst({ where : { email  , password } })
}
