import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    let careers = await prisma.career.findMany()
    if(careers) {
        return res.status(200).json(careers)
    }
    return res.status(401).json({message : ''})
    
}
