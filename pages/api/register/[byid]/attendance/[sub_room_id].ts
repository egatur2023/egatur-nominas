import { NextApiRequest, NextApiResponse } from "next";
import { createAttendances } from "resources/services/attendance/createAttendances";
import { getAttendancesBySubscriptionRoomId } from "resources/services/attendance/getAttendancesBySubscriptionRoomId";
import { getCourseBySubModuleIdAndName } from "resources/services/course/getCourseBySubModuleIdAndName";
import { getSubscriptionRoomById } from "resources/services/subroom/getSubscriptionRoomById";
import { ResultGetAttendancesBySubscriptionRoomId, ResultGetCourseBySubModuleIdAndName, ResultGetSubscriptionRoomById } from "resources/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const subRoomId : number = parseInt(req.query.sub_room_id as string) || 0
    let resultCourse : ResultGetCourseBySubModuleIdAndName | null = null,
        attendances : ResultGetAttendancesBySubscriptionRoomId = []
    const subscriptionRoom : ResultGetSubscriptionRoomById = await getSubscriptionRoomById(subRoomId)

    if(subscriptionRoom){
        resultCourse = await getCourseBySubModuleIdAndName(subscriptionRoom.subscriptionModuleId, subscriptionRoom.courseName)
        attendances = await getAttendancesBySubscriptionRoomId(subRoomId)
        if(attendances.length == 0 && resultCourse){
            await createAttendances({
                subRoomId : subscriptionRoom.id,
                sessions : resultCourse.module.courses[0].sessions
            })
            attendances = await getAttendancesBySubscriptionRoomId(subRoomId)
        }
    }


    const data = {
        studentFullname : resultCourse?.register.student.fullName || "-----",
        dateAdmision : subscriptionRoom?.room.name || "-----",
        schedule : subscriptionRoom?.room.schedule || "-----",
        attendances
    }
    return res.json(data)
}
