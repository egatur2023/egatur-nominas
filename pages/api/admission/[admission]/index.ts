import { NextApiRequest, NextApiResponse } from "next";
import { getSubscriptionsRoomByAdmission } from "resources/services/subroom/getSubscriptionsRoomByRoomId";

export default async function handler(req : NextApiRequest, res : NextApiResponse){
    console.log({query : req.query.admission})
    const result = await getSubscriptionsRoomByAdmission(String(req.query.admission as string))

    return res.status(200).json(result)
}
