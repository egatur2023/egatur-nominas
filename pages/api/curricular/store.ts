import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    try {
        let curricular = await prisma.curricularStructure.create({
            data : {
                year : String(req.body.year),
                month: req.body.month,
                code : `${req.body.month}-${req.body.isRegular?"R":"I"}-${req.body.year}`,
                isRegular : Boolean(req.body.isRegular),
                careerId : req.body.careerId,
            }
        })
        return res.status(200).json(curricular)
    } catch (error) {
        return res.status(500).json({message : "No se pudo crear malla curricular."})
    }
}
