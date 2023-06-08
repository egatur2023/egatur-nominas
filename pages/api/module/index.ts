import type { NextApiRequest, NextApiResponse } from 'next'
import { useRouter } from 'next/router'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    const { cid } = req.query
    let modules = await prisma.module.findMany()


    if(modules){
      return res.status(200).json(modules)
    }
    return res.status(401).json({message : ''})
}