import { Prisma } from "prisma/prisma-client"
import { prisma } from '@prisma/db'

export const getSubscriptionsRoomByRoomId = async (roomId: number) => {
    const executeQuery = async () => await prisma.subscriptionRoom.findMany({
        where: {
            roomId
        },
        include: {
            room : true,
            subscriptionModule : {
                select : {
                    register : {
                        select : {
                            student : true
                        }
                    }
                }
            }
        }
    })

    type TypeResultSubs = Prisma.PromiseReturnType<typeof executeQuery>

    const result = await executeQuery()

    type GroupedResult = Record<string,{studentFullName : string , admissions : TypeResultSubs }>

    let resultGrouped : GroupedResult = result.reduce((acc : GroupedResult, curr) => {
        let keyStudentId = curr.subscriptionModule.register.student.id
        acc[keyStudentId] = acc[keyStudentId] || {studentFullName : curr.subscriptionModule.register.student.fullName , admissions : []}
        acc[keyStudentId].admissions.push(curr)
        return acc
    },{})
    return resultGrouped
}
