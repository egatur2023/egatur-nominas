import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    let curricularStructures = await prisma.curricularStructure.findMany()

    if(curricularStructures){
      return res.status(200).json(curricularStructures)
    }
    return res.status(401).json({message : ''})
}