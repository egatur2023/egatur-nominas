import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/db'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    let updateCurricular = await prisma.curricularStructure.update({
        data : {
            code :`${req.body.month}-${req.body.isRegular?"R":"I"}-${req.body.year}`,
            month: req.body.month,
            isRegular : Boolean(req.body.isRegular),
            year : req.body.year
        },
        where : {
            id : req.body.id
        }
    })
    return res.status(200).json(updateCurricular)
}