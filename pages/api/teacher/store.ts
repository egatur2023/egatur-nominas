import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from './../../../prisma/db'
export default async function handler(req : NextApiRequest , res : NextApiResponse){
    try {
        const student = await prisma.teacher.create({
            data : {
                fullName : req.body.fullName,
                dni : req.body.dni,
                telephone : req.body.telephone ,
            }
        })
        return res.status(200).json(student)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "No se pudo crear al docente"})
    }


}
