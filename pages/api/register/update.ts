import { Course } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    try {
        let register = await prisma.register.update({
            where : {
                id : parseInt(req.body.registerId as string) || 0
            },
            data : {
                dateStart : new Date(req.body.dateStart).toISOString(),
                dateEnd : req.body.dateEnd ? new Date(req.body.dateEnd).toISOString() : null,
            }
        })
        return res.status(200).json(register)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : "No se pudo actualizar el registro."})
    }
}
