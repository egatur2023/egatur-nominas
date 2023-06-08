import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";
import { Prisma, SubscriptionRoom } from "prisma/prisma-client";
import { DtoCreateSubModule } from "resources/types";
import { prisma } from '../../../prisma/db'
export default async function handler(req : NextApiRequest , res : NextApiResponse){

    const registerId = parseInt(req.body.registerId as string)
    const subModules : DtoCreateSubModule[] = req.body.toEnrollSubModules
    // console.log(subModules)
    const response = await Promise.all(
        subModules?.map(async(subModule) => {
            const subM = await prisma.subscriptionModule.findFirst({
                where : {
                    moduleId : subModule.moduleId,
                    registerId : registerId
                }
            })

            if(subM){
                return await prisma.subscriptionRoom.createMany({
                    data : subModule.toEnrollSubRooms.map(subRoom => ({
                        courseName : subRoom.courseName,
                        score : 0 ,
                        roomId : subRoom.roomId,
                        subscriptionModuleId : subM.id,
                        quantityUpdated : 0
                    }))
                })
            }

            return await prisma.subscriptionModule.create({
                data : {
                    registerId : registerId,
                    moduleId : subModule.moduleId,
                    subscriptionsRoom : {
                        createMany : {
                            data : subModule.toEnrollSubRooms.map(subRoom => ({
                                courseName : subRoom.courseName,
                                score : 0 ,
                                roomId : subRoom.roomId,
                                quantityUpdated : 0
                            }))
                        }
                    }
                }
            })
        })
    )

    return res.status(200).json(response)
    // return res.status(200).json([])
}
