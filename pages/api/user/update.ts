import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { updateUser } from "resources/services/user/update";

export default async function handler(req : NextApiRequest , res : NextApiResponse){

    const user = req.body as User
    const result = await updateUser(user)
    return res.status(200).json(result)
}
