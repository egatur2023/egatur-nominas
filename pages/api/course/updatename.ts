import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../prisma/db'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const courseName = await prisma.subscriptionRoom.update({
            where: {
                id: parseInt(req.body.id)
            },
            data: {
                courseName: req.body.name,
            }
        })
        return res.status(200).json(courseName)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ errormMessage: `No se pudo actualizar el nombre del curso` })
    }
}
