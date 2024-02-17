import { prisma } from '@prisma/db'
import { Prisma } from 'prisma/prisma-client'
export async function storePermission(values : Prisma.PermissionUncheckedCreateInput){
    return await prisma.permission.create({
        data : values
    })
}
