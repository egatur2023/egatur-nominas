import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { byCurricularId } = req.query
    if (byCurricularId) {
        let modules = await prisma.module.findMany({
            where: { curricularStructureId: parseInt(byCurricularId as string) },
            orderBy: [
                {
                    name: 'asc'
                }
            ],
            include: {
                courses: {
                    include: {
                        rooms: true
                    }
                }
            }
        })

        if (modules) {
            return res.status(200).json(modules)
        }
    }
    return res.status(401).json({ message: 'Error en byCurricularId' })
}
