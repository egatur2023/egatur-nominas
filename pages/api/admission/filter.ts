import { NextApiRequest, NextApiResponse } from "next";
import { getAdmissionsByAdmission, getAdmissionsByAdmissionScheduleIn } from "resources/services/subroom/getRoomsByCareer";
import { ResultGetAdmissionsByAdmission } from "resources/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body)
    let result : ResultGetAdmissionsByAdmission = []
    let admissions : string[] = []
    if(req.body.careerName && req.body.month && req.body.year && req.body.schedule){
        if(req.body.schedule == "Todos" ){
            admissions = [
                `${req.body.careerName == "Barismo" ? "BRM" : req.body.careerName.substring(0,2).toUpperCase()}-${req.body.month.substring(0,3)}-${req.body.year}-M`,
                `${req.body.careerName == "Barismo" ? "BRM" : req.body.careerName.substring(0,2).toUpperCase()}-${req.body.month.substring(0,3)}-${req.body.year}-T`,
                `${req.body.careerName == "Barismo" ? "BRM" : req.body.careerName.substring(0,2).toUpperCase()}-${req.body.month.substring(0,3)}-${req.body.year}-N`
            ]
            result = await getAdmissionsByAdmissionScheduleIn(admissions)
            console.log(admissions)
        }else{
            admissions = [`${req.body.careerName == "Barismo" ? "BRM" : req.body.careerName.substring(0,2).toUpperCase()}-${req.body.month.substring(0,3)}-${req.body.year}-${req.body.schedule.substring(0,1)}`]
            result = await getAdmissionsByAdmission(admissions[0])
        }
    }

    // let response : ResultGetRoomsByCareer = []



    return res.json(result)
}
