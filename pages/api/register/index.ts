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
      dateAdmision: register?.curricular.career.name == "Barismo" ? `BRM - ${register?.dateStart.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} ${register?.dateStart.getFullYear()}` : `${register?.curricular.career.name.substring(0,3).toUpperCase()} - ${register?.dateStart.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} ${register?.dateStart.getFullYear()}`,
      careerName : register.curricular.career.name,
      curricularName : register.curricular.code,
      dateStart : DateTime.fromJSDate(register.dateStart).toUTC().toISODate(),
      dateEnd : register?.dateEnd ?  DateTime.fromJSDate(register?.dateEnd).toUTC().toISODate() : "",
      scheduleAdmision : register.scheduleAdmision,
      observation : register.observations
    }
  })
  return res.status(200).json(registerFlat)
}
