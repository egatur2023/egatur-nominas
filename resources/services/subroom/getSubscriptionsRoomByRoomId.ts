import { Prisma } from "prisma/prisma-client"
import { prisma } from '@prisma/db'
import { GroupedResult } from "resources/types"

export const getSubscriptionsRoomByAdmission = async (admision: string) => {

    const result = await executeQueryGetSubsRoomByAdmission(admision)
    let coursesNamesKeys = new Set<string>()
    let resultGrouped : GroupedResult = result.reduce((acc : GroupedResult, curr) => {
        let keyStudentId = curr.subscriptionModule.register.student.id
        acc[keyStudentId] = acc[keyStudentId] || {studentFullName : curr.subscriptionModule.register.student.fullName , courses : []}
        acc[keyStudentId].courses.push(curr)
        return acc
    },{})

    result.forEach(subRoom => coursesNamesKeys.add(subRoom.courseName))
    return { admissions : resultGrouped , coursesNames : Array.from(coursesNamesKeys.values()) }
}


export const executeQueryGetSubsRoomByAdmission = async (admision: string) => await prisma.subscriptionRoom.findMany({
    where: {
        // roomId

        subscriptionModule : {
            register : {
                admision
            }
        }

        // room: {
        //     name : {
        //         contains : admision
        //     }
        // }
    },
    include: {
        attendances : true,
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
    }
})
