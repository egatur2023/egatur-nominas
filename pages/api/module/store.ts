import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    try {
        let createdModule = await prisma.module.create({
            data : {
                name : req.body.name,
                curricularStructureId : req.body.curricularId
            }
        })
        return res.status(200).json(createdModule)
    } catch (error) {
        return res.status(500).json({message : "No se pudo crear el modulo."})
    }
}
