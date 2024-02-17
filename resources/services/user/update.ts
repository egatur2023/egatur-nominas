import { User } from "@prisma/client";
import { prisma } from '@prisma/db'
export async function updateUser(user : User) {
    return await prisma.user.update({
        where : {
            id : user.id
        },
        data : {
            roleId : user.roleId,
        }
    })
}
