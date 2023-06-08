import { DateTime } from 'luxon'
import type { NextApiRequest, NextApiResponse } from 'next'
import { filterByAdmision, filterByAdmisionAndCareerId, filterByCareerId, filterByCarrerIdAndCurricularId, filterByCurricularId } from 'resources/functions/report'
import { DtoResponseReport } from 'resources/types'
import { inspect } from 'util'
import { prisma } from '../../../prisma/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const careerId = parseInt(req.body.careerId) || 0
    const curricularId = parseInt(req.body.curricularId) || 0
    const dateStart = req.body.dateStart as string
    const dateEnd = req.body.dateEnd as string   // sumar 7 dias en adelante por defecto
    const admision = req.body.admision || ""


    let response: DtoResponseReport[] = []
    if (dateStart && dateEnd) {
        console.log("######")
        console.log(req.body)
        console.log("######")

        //POR UNA CURRICULA
        if (careerId == 0 && curricularId != 0 && admision == "") {
            response = await filterByCurricularId({ dateEnd, dateStart, curricularId })
        }


        if (careerId != 0) {
            //POR CARRERA
            if (curricularId == 0 && admision == "") {
                response = await filterByCareerId({ dateEnd, dateStart, careerId })
            }
            //POR CARRERA Y CURRICULA
            if (curricularId != 0 && admision == "") {
                response = await filterByCarrerIdAndCurricularId({ dateEnd, dateStart, careerId, curricularId })
            }
        }

        if (admision != "") {
            //POR ADMISION
            if (careerId == 0 && curricularId == 0) {
                response = await filterByAdmision({ dateEnd, dateStart, admision })
            }

            //POR ADMISION Y CARRERA
            if (careerId != 0 && curricularId == 0) {
                response = await filterByAdmisionAndCareerId({ dateEnd, dateStart, admision, careerId })
            }
        }


    }

    return res.status(200).json(response)
}
