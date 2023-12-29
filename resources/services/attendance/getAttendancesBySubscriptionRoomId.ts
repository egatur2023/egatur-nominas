import { prisma } from '@prisma/db'

export const getAttendancesBySubscriptionRoomId = async (subscriptionRoomId: number) => {
  const assistances = await prisma.attendance.findMany({
    where: {
      subscriptionRoomId
    }
  })

  return assistances
}
