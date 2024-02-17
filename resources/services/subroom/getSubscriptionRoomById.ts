import { SubscriptionRoom } from "@prisma/client";
import { prisma } from '@prisma/db'

export const getSubscriptionRoomById = async (id: number) => {
    return await prisma.subscriptionRoom.findUnique({
        where: {
            id
        },
        include: {
            room : {
                include : {
                    teacher : true
                }
            }
        }
    })
}
