import { NextApiRequest, NextApiResponse } from "next";
import { getModulesSystem } from "resources/services/ms/list";

export default async function handler(req : NextApiRequest , res : NextApiResponse){
    const modulesSystem = await getModulesSystem()

    return res.status(200).json(modulesSystem)
}
