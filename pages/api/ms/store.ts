import { NextApiRequest, NextApiResponse } from "next";
import { storeModuleSystem } from "resources/services/ms/store";
import { storePermission } from "resources/services/permission/store";
import { getRoles } from "resources/services/role/list";
import { DtoCreateModuleSystem } from "resources/types";

export default async function handler(req : NextApiRequest , res : NextApiResponse){

    const moduleSystem = await storeModuleSystem(req.body as DtoCreateModuleSystem)
    const roles = await getRoles()
    const promises =  roles.map(async role => {
        return await storePermission({
            roleId : role.id ,
            moduleId : moduleSystem.id,
            create : false,
            read : false,
            update : false,
            delete : false
        })
    })

    await Promise.all(promises)

    return res.status(200).json({})
}
