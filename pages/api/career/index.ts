import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    let careers = await prisma.career.findMany()
    try {
        return res.status(200).json(careers)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : 'No se pudo obtener las carreras.'})
    }
}
