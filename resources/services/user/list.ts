import { prisma } from '@prisma/db'
export async function getUsers() {

    return await prisma.user.findMany({
        include : {
            role : true
        }
    })
}
