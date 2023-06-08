import { prisma } from '../../prisma/db'

export async function getRegisterWithRelations1(registerId : number){
    return await prisma.register.findFirst({
        where : {
            id : registerId
        },
        include : {
          student : {
            select : {
                fullName : true,
                admision : true
            }
          },
          curricular : {
              include : {
                  career : true
              }
          },
          subscriptionsModule : {
            include : {
              module : {
                select : {
                    name : true,
                }
              },
              subscriptionsRoom : {
                select : {
                    id : true,
                    courseName : true,
                    quantityUpdated : true,
                    score: true,
                    room : {
                        select : {
                            dateStart : true ,
                            dateEnd : true,
                            teacher : {
                                select : {
                                    fullName : true
                                }
                            },
                            course : {
                                select : {
                                    name : true,
                                    type : true,
                                }
                            }
                        }
                    },
                }
              }
            }
          }
        }
      })
}
