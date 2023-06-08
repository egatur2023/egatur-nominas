import { prisma } from '../../prisma/db'
export default async function getRoomsByCourseId(byCourseId : number){
    const rooms =  await prisma.room.findMany({
        where : {
            courseId : byCourseId
        },
        include : {
            teacher : true,
            course : {
              select : {
                  moduleId : true,
                  module : {
                      select : {
                          curricularStructure : {
                              select : {
                                  career : {
                                      select : {
                                          name : true
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
            }
        }
      })

    return rooms?.map( room => (
        {
            ...room,
            careerName : room.course.module.curricularStructure.career.name
        }
    ))
}
