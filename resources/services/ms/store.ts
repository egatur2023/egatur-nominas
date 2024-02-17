import { DtoCreateModuleSystem } from "resources/types";
import { prisma } from '@prisma/db'
export async function storeModuleSystem(values : DtoCreateModuleSystem){

    return await prisma.moduleSystem.create({
        data : {
            name : values.name
        }
    })
}
