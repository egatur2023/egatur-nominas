import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    let teachers = await prisma.teacher.findMany()

    if(teachers){
      return res.status(200).json(teachers)
    }
    return res.status(200).json([])
}