import { prisma } from '@prisma/db'
export async function getModulesSystem(){
    return await prisma.moduleSystem.findMany()
}
