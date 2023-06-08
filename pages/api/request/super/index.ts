import { DateTime } from 'luxon'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getRequestForAdmin, getRequestForSuper } from 'resources/services/request'
import { DtoResRequestsForAdmin, DtoResRequestsForSuper } from 'resources/types'


export default async function handler( req: NextApiRequest, res: NextApiResponse ) {

    try {
        const requests = await getRequestForSuper()
        const result : DtoResRequestsForSuper[] = requests.map( request => ({
            requestId : request.id,
            dateRequest : DateTime.fromISO(request.dateRequest.toISOString()).toUTC().toISODate(),
            student : request.subscriptionRoom.subscriptionModule.register.student.fullName,
            userName : request.user.username,
            courseName : request.subscriptionRoom.courseName,
            stateRequest : request.stateUpdate,
            observation : request.observation,
            documents : request.documents,
            reason : request.reason,
            score : request.subscriptionRoom.score,
            curricularName : request.subscriptionRoom.subscriptionModule.register.curricular.code,
            registerId : request.subscriptionRoom.subscriptionModule.register.id,
            subRoomId : request.subscriptionRoom.id,
        }))

        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({message : "No se pudo obtener las solicitudes."})
    }
}
