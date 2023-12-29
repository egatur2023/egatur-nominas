import { prisma } from '@prisma/db'
export async function getCourseBySubModuleIdAndName(subModuleId : number, courseName : string){

    return await prisma.subscriptionModule.findFirst({
        where: {
            id : subModuleId
        },
        include: {
            module: {
                include: {
                    courses : {
                        where : {
                            name : courseName
                        }
                    }
                }
            },
            register : {
                select : {
                    student : {
                        select : {
                            fullName : true
                        }
                    }
                }
            }
        }
    })
}
