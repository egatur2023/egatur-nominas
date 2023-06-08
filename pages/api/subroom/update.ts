import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../prisma/db'
export default async function handler(req : NextApiRequest , res : NextApiResponse){
    const updatedSubRoom = await prisma.subscriptionRoom.update({
        where : {
            id : parseInt(req.body.subRoomId)
        },
        data : {
            roomId : req.body.roomId,
        }
    })

    return res.status(200).json(updatedSubRoom)
}
