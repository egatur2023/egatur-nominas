import { DateTime } from 'luxon'
import type { NextApiRequest, NextApiResponse } from 'next'
import { DtoResRegister } from 'resources/types'
import { prisma } from '../../../prisma/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const registers = await prisma.register.findMany({
    include : {
      curricular : {
        include : {
            career : true
        }
      },
      student : true,
    }
  })

  const registerFlat : DtoResRegister[] = registers.map(register => {
    return {
      id : register.id,
      fullName : register.student.fullName,
      dateAdmision : register.student.admision,
      careerName : register.curricular.career.name,
      curricularName : register.curricular.code,
      dateStart : DateTime.fromJSDate(register.dateStart).toUTC().toISODate(),
      dateEnd : register?.dateEnd ?  DateTime.fromJSDate(register?.dateEnd).toUTC().toISODate() : "",
      scheduleAdmision : register.scheduleAdmision
    }
  })
  return res.status(200).json(registerFlat)
}
