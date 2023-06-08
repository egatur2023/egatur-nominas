import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
  const { byCareerId } = req.query
    if(byCareerId){
    let curricularStructures = await prisma.curricularStructure.findMany({
        where : { careerId : parseInt(byCareerId as string) },
        include : {
          career : true
        }
    })

    if(curricularStructures){
      return res.status(200).json(curricularStructures)
    }
    }
    return res.status(401).json({message : 'Error en byCareerId'})
}