import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    try {
        let updateModule = await prisma.module.update({
            data : {
                name : req.body.name,
            },
            where : {
                id : req.body.id
            }
        })
        return res.status(200).json(updateModule)
    } catch (error) {
        return res.status(500).json({message : "No se pudo editar el módulo."})
    }
}
