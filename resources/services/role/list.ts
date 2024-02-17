import { prisma } from "@prisma/db";
export async function getRoles(){

    return await prisma.role.findMany({
        include: {
            permissions: {
                include: {
                    module: true
                }
            }
        }
    })
}
