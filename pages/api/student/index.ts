import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    let students = await prisma.student.findMany()

    if(students){
      return res.status(200).json(students)
    }
    return res.status(401).json({message : ''})
}