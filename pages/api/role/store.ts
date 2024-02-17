import { NextApiRequest, NextApiResponse } from "next";
import { getModulesSystem } from "resources/services/ms/list";
import { storePermission } from "resources/services/permission/store";
import { storeRole } from "resources/services/role/store";

export default async function handler(req : NextApiRequest , res : NextApiResponse){
    const nameRole = req.body.name
    console.log({nameRole})
    const role = await storeRole({name : nameRole})

    const modulesSystem = await getModulesSystem()

    await Promise.all(modulesSystem.map(async (module) =>
        await storePermission({
            roleId : role.id ,
            moduleId : module.id ,
            create : false ,
            delete : false ,
            read : false ,
            update : false
        })
    ))
    return res.status(200).json({})
}
