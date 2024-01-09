import { DateTime } from 'luxon'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, SubscriptionModule, SubscriptionRoom } from 'prisma/prisma-client'
import { getRegisterWithRelations1 } from 'resources/services/register'
import { DtoResRegisterWithSubRooms, RegisterWithRelations1 } from 'resources/types'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const byid : number = parseInt(req.query.byid as string) || 0
    if(byid){
        try {
            const register  =  await getRegisterWithRelations1(byid)

              let flatRegister : DtoResRegisterWithSubRooms = {
                id : register?.id || 0,
                fullName : register?.student.fullName || "",
                scheduleAdmision : register?.scheduleAdmision || "",
                register?.curricular.career.name == "Barismo" ? `BRM - ${register?.dateStart.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} ${register?.dateStart.getFullYear()}` : `${register?.curricular.career.name.substring(0,3).toUpperCase()} - ${register?.dateStart.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} ${register?.dateStart.getFullYear()}`,
                subRooms : []
              }
              register?.subscriptionsModule.forEach((subModule) => {
                subModule?.subscriptionsRoom.forEach((subRoom) => {
                    flatRegister.subRooms.push({
                      subRoomId : subRoom.id,
                      courseName : subRoom.courseName,
                      typeCourse : subRoom.room.course.type,
                      moduleName :  subModule.module.name,
                      teacherName : subRoom.room?.teacher?.fullName || "",
                      dateStart: DateTime.fromISO(subRoom.room?.dateStart.toISOString()).toUTC().toISODate(),
                      dateEnd: DateTime.fromISO(subRoom.room?.dateEnd.toISOString()).toUTC().toISODate(),
                      score: subRoom.score,
                      quantityUpdated : subRoom.quantityUpdated
                    })
                })
              })
            return res.status(200).json(flatRegister)
        } catch (error) {
            console.log(error)
            return res.status(404).json({message : `No se pudo realizar la busqueda para ${byid}}`})
        }
    }

    return res.status(200).json({message : `No se pudo encontrar un registro para ${byid}}`})
}
