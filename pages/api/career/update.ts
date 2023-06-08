import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    try {
        const updateCareer = await prisma.career.update({
            data : {
                name : req.body.name,
            },
            where : {
                id : req.body.id
            }
        })
        return res.status(200).json(updateCareer)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "No se pudo actualizar"})
    }
}
