import { prisma } from '@prisma/db'
import { Prisma } from '@prisma/client'
import { DateTime } from 'luxon'
export async function createAttendances({subRoomId , sessions} : {subRoomId : number , sessions : number}){

    return await prisma.attendance.createMany({
        data : Array.from({length : sessions}).map((_, i) => ({
            subscriptionRoomId : subRoomId,
            date : DateTime.now().startOf('year').toJSDate(),
            stateAttendance : "PENDIENTE",
            observation : ""
        })) as Prisma.AttendanceCreateManyInput[]
    })
}
