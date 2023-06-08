import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'
import {DateTime} from 'luxon'
export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    let course = await prisma.course.create({
        data : {
            name : req.body.name,
            moduleId : req.body.moduleId,
            type : req.body.type,
            sessions : parseInt(req.body.sessions),
        }
    })
    return res.status(200).json(req.body)
}