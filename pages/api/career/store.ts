import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    try {
        let career = await prisma.career.create({
            data : {
                name : req.body.name
            }
        })
        return res.status(200).json(career)
    } catch (error) {
        return res.status(500).json({message : `No se pudo crear la Carrera : ${req.body.name}`})
    }

}
