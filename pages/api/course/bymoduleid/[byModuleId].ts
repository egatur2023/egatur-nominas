import type { NextApiRequest, NextApiResponse } from 'next'
import getCoursesByModuleId from 'resources/services/course'
import { prisma } from '../../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
  const byModuleId = parseInt(req.query.byModuleId as string) || 0
    if(byModuleId){
        let courses = await getCoursesByModuleId(byModuleId)
        return res.status(200).json(courses)
    }
    return res.status(401).json({message : 'Error en byCareerId'})
}
