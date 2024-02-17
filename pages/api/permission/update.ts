import { Permission } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { updatePermission } from "resources/services/permission/update";

export default async function handler(req : NextApiRequest , res : NextApiResponse){

    const permission = req.body as Permission
    await updatePermission(permission)
    return res.status(200).json({})
}
