import { AttendanceState } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@prisma/db'
export default async function handler( req : NextApiRequest , res : NextApiResponse ) {
    await prisma.attendance.update({
        where : {
            id : Number(req.body.attendanceId)
        },
        data : {
            date : new Date(req.body.date).toISOString(),
            observation : req.body.observation as string,
            stateAttendance : req.body.stateAttendance as AttendanceState,
        }
    })
    res.status(200).json({ message : "Actualizado"})
}
