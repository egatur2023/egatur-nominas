import { NextApiRequest, NextApiResponse } from "next";
import { getSubscriptionsRoomByRoomId } from "resources/services/subroom/getSubscriptionsRoomByRoomId";

export default async function handler(req : NextApiRequest, res : NextApiResponse){

    const result = await getSubscriptionsRoomByRoomId(parseInt(req.query.room_id as string))
    console.log({result})
    return res.status(200).json(result)
}
