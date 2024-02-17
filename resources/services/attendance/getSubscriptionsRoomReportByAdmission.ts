import { Prisma } from "prisma/prisma-client"
import { prisma } from '@prisma/db'
import { GroupedResult } from "resources/types"

export const getSubscriptionsRoomReportByAdmission = async (admision: string) => {

    const result = await executeQueryGetSubsRoomByAdmission(admision)
    let coursesNamesKeys = new Set<string>()
    let resultGrouped : GroupedResult = result.reduce((acc : GroupedResult, curr) => {
        let keyStudentId = curr.subscriptionModule.register.student.id
        acc[keyStudentId] = acc[keyStudentId] || {studentFullName : curr.subscriptionModule.register.student.fullName , courses : []}
        acc[keyStudentId].courses.push(curr)
        acc[keyStudentId].courses.sort((c1,c2) => c1.courseName > c2.courseName ? 1 : -1)
        return acc
    },{})

    result.forEach(subRoom => coursesNamesKeys.add(subRoom.courseName))
    return resultGrouped
}


export const executeQueryGetSubsRoomByAdmission = async (admision: string) => await prisma.subscriptionRoom.findMany({
    where: {
        // roomId

        subscriptionModule : {
            register : {
                admision
            }
        }
    },
    include: {
        attendances : true,
        // room : true,
        subscriptionModule : {
            select : {
                register : {
                    select : {
                        id : true,
                        curricularId : true,
                        student : {
                            select : {
                                id : true,
                                fullName : true,
                                code : true,
                                admision : true
                            }
                        }
                    }
                }
            }
        }
    },
})
