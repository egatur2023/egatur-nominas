import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    let courses = await prisma.course.findMany()

    if(courses){
      return res.status(200).json(courses)
    }
    return res.status(401).json({message : ''})
}