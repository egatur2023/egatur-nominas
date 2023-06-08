import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    let updateCourse = await prisma.course.update({
        data : {
            name : req.body.name,
            sessions : parseInt(req.body.sessions),
            type : req.body.type
        },
        where : {
            id : req.body.id
        }
    })
    return res.status(200).json(updateCourse)
}