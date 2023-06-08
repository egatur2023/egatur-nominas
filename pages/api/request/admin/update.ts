import { DateTime } from 'luxon'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getRequestForAdmin } from 'resources/services/request'
import { DtoResRequestsForAdmin } from 'resources/types'


export default async function handler( req: NextApiRequest, res: NextApiResponse ) {

    try {
        const requestUpdated = await prisma?.request.update({
            where : {
                id : req.body.requestId
            },
            data : {
                observation : req.body.observation,
                stateUpdate : req.body.stateUpdate
            }
        })
        return res.status(200).json(requestUpdated)
    } catch (error) {
        return res.status(500).json({message : "No se pudo actualizar la solicitud."})
    }
}
