import { prisma } from '@prisma/db'
export async function getRoomsByCareer(careerId: number, dateStart: string, dateEnd: string) {
    let result = await prisma.room.findMany({
        where : {
            course : {
                module : {
                    curricularStructure : {
                        careerId : careerId
                    }
                }
            },
            dateStart : {
                gte : new Date(dateStart)
            },
            dateEnd : {
                lte : new Date(dateEnd)
            }
        },
    })
    return result
}
