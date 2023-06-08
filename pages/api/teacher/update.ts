import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    try {
        const updateTeacher = await prisma.teacher.update({
            data : {
                dni: req.body.dni,
                fullName : req.body.fullName,
                telephone: req.body.telephone
            },
            where : {
                id : req.body.id
            }
        })
        return res.status(200).json(updateTeacher)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "No se pudo actualizar"})
    }
}
