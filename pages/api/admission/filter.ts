import { NextApiRequest, NextApiResponse } from "next";
import { getRoomsByCareer } from "resources/services/subroom/getRoomsByCareer";
import { ResultGetRoomsByCareer } from "resources/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body)
    let response : ResultGetRoomsByCareer = []
    if(req.body.careerId){
        response = await getRoomsByCareer(parseInt(req.body.careerId),req.body.dateStart,req.body.dateEnd)
    }

    return res.json(response)
}
