import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {

    try {
        let room = await prisma.room.update({
            where : {
                id : req.body.id
            },
            data : {
                name : req.body.name,
                dateStart : new Date(req.body.dateStart).toISOString(),
                dateEnd :  new Date(req.body.dateEnd).toISOString(),
                hourStart: req.body.hourStart,
                hourEnd: req.body.hourEnd,
                schedule : req.body.schedule,
                teacherId : req.body.teacherId,
                frecuency : req.body.frecuency,
                section: req.body.section
            }
        })
        return res.status(200).json(room)
    } catch (error) {
        return res.status(500).json({message : "No se pudo actualizar el salón."})
    }
}
