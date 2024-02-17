import { NextApiRequest, NextApiResponse } from "next";
import { getRoles } from "resources/services/role/list";


export default async function handler( req : NextApiRequest , res : NextApiResponse){

    const roles = await getRoles()

    return res.status(200).json(roles)
}
