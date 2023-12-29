import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    try {
        console.log({RATA:req.body})
        let register = await prisma.register.update({
            where : {
                id : parseInt(req.body.registerId as string) || 0
            },
            data : {
                observations : req.body.observation as string
            }
        })
        return res.status(200).json(register)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : "No se pudo actualizar la observación."})
    }
}
