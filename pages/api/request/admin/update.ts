import { prisma } from '@prisma/db'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function handler( req: NextApiRequest, res: NextApiResponse ) {

    try {
        const requestUpdated = await prisma.request.update({
            where : {
                id : req.body.requestId
            },
            data : {
                observation : req.body.observation,
                stateUpdate : req.body.stateUpdate
            }
        })
        console.log({body : req.body})
        return res.status(200).json(requestUpdated)
    } catch (error) {
        return res.status(500).json({message : "No se pudo actualizar la solicitud."})
    }
}
