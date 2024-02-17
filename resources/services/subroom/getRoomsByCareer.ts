import { prisma } from '@prisma/db'
export async function getAdmissionsByAdmission(admission : string) {
    return await prisma.register.findMany({
        include : {
            curricular : true
        },
        distinct : ["admision"],
        where : {
            admision : admission
        },
    })

    //obtener registros[student,carrer]
    //
    // return result
}

export async function getAdmissionsByAdmissionScheduleIn(admissions : string[]) {
    console.log({ra : admissions})
    return await prisma.register.findMany({
        include : {
            curricular : true
        },
        distinct : ["admision"],
        where : {
            admision : {
                in : admissions
            }
        },
    })
}

