import { Course } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ScheduleType } from 'resources/types'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    try {
        let register = await prisma.register.create({
            data : {
                studentId: parseInt(req.body.studentId),
                curricularId : parseInt(req.body.curricularId),
                dateStart : new Date(req.body.dateStart).toISOString(),
                scheduleAdmision : req.body.scheduleAdmision
            }
        })
        return res.status(200).json(register)
    } catch (error) {
        return res.status(500).json({message : "No se pudo crear el registro."})
    }
}
