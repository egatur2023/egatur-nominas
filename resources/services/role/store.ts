import { prisma } from '@prisma/db'
import { Prisma } from '@prisma/client'
export async function storeRole(values : Prisma.RoleUncheckedCreateInput){
    return await prisma.role.create({
        data : values
    })
}
