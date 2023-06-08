import type { NextApiRequest, NextApiResponse } from 'next'
import { DtoResRegisterRowCourse } from 'resources/types'
import { prisma } from '../../../../prisma/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const {  byRegisterId } = req.query

    if(parseInt(byRegisterId as string) > 0){
        const register = await prisma.register.findUnique({
          where : {
              id : parseInt(byRegisterId as string)
          },
          include : {
            curricular : {
                include : {
                    career : true
                }
            },
            student : true,
            subscriptionsModule : {
              include : {
                module : true,
                subscriptionsRoom : {
                  include : {
                    room : {
                      include : {
                        course : {
                            include : {
                              rooms : true
                            }
                        },
                        teacher : true
                      }
                    },
                  }
                }
              }
            }
          }
        })

        let flatRegister : { id : number , fullName : string , scheduleAdmision : string , dateAdmision : string , curricularId : number , curricularName : string , courses : DtoResRegisterRowCourse[] } = {
          id : register?.id || 0,
          fullName : register?.student.fullName || "",
          scheduleAdmision : register?.scheduleAdmision || "",
          dateAdmision : register?.student.admision || "",
          curricularId : register?.curricularId || 0,
          curricularName : register?.curricular?.code || "",
          courses : []
        }
        register?.subscriptionsModule.forEach(subModule => {
          subModule.subscriptionsRoom.forEach(subRoom => {
              flatRegister.courses.push({
                subscriptionCourseId : subRoom.id,
                courseName : subRoom.courseName,
                typeCourse : subRoom.room.course.type,
                moduleName :  subModule.module.name,
                teacherName : subRoom.room?.teacher?.fullName || "",
                dateStart: subRoom.room?.dateStart,
                dateEnd: subRoom.room?.dateEnd,
                score: subRoom.score,
                rooms : subRoom.room.course.rooms,
                roomId: subRoom.roomId,
                courseId : subRoom.room.course.id,
                roomName : subRoom.room?.name
              })
          })
        })

      return res.status(200).json(flatRegister)
    }

    return res.status(404).json("Error Filter")
}
