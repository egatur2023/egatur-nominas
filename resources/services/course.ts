import { prisma } from '../../prisma/db'
export default async function getCoursesByModuleId(byModuleId : number){
    return await prisma.course.findMany({
        include:{
            module : true
        },
        where : { moduleId : byModuleId }
    })
}
