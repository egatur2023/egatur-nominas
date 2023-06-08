import type { NextApiRequest, NextApiResponse } from 'next'
import getRoomsByCourseId from 'resources/services/room'
import { RoomsByCourseId1 } from 'resources/types'
import { prisma } from '../../../../prisma/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const byCourseId : number  = parseInt(req.query.byCourseId as string) || 0

    if(byCourseId){
        const rooms : RoomsByCourseId1 = await getRoomsByCourseId(byCourseId)

      return res.status(200).json(rooms)
    }

    return res.status(404).json("Error Filter")
}
