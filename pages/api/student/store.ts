import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from './../../../prisma/db'
export default async function handler(req : NextApiRequest , res : NextApiResponse){
    try {
        const student = await prisma.student.create({
            data : {
                code : req.body.code,
                fullName : req.body.fullName,
                dni : req.body.dni,
                telephone : req.body.telephone ,
                admision : req.body.admision,
                dateStart : new Date(req.body.dateStart).toISOString(),
            }
        })
        return res.status(200).json(student)
    } catch (error) {
        console.log("###ERROR STUDENT STORE#######")
        console.log(error)
        console.log("-----ERROR STUDENT STORE---------")
        return res.status(500).json({message : "No se pudo crear al estudiante"})
    }


}
