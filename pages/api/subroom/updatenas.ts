import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../prisma/db'
export default async function handler(req : NextApiRequest , res : NextApiResponse){
    //update Name And Score
    try {
        const subCourse = await prisma.subscriptionRoom.update({
            where : {
                id : parseInt(req.body.id)
            },
            data : {
                score : parseInt(req.body.score),
                courseName : req.body.courseName as string,
            }
        })
        console.log("ACTUALIZADO",subCourse)
        console.log("CON",req.body)
        return res.status(200).json(subCourse)
    } catch (error) {
        return res.status(500).json({ errormMessage: `No se pudo actualizar la nota y nombre del curso` })
    }

}
