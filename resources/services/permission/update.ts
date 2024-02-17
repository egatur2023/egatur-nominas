import { Permission } from "@prisma/client";
import {prisma} from "@prisma/db";
export async function updatePermission(permission : Permission){
    return await prisma.permission.update({
        where : { id : permission.id } ,
        data : {
            create : permission.create ,
            delete : permission.delete ,
            read : permission.read ,
            update : permission.update,
            moduleId : permission.moduleId ,
            roleId : permission.roleId

        }
    })
}
