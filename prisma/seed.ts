import { PrismaClient, Prisma } from "@prisma/client";
import { DateTime } from "luxon";


const prisma = new PrismaClient();

async function main() {

    // try {
    //     await prisma.user.deleteMany()
    //     await prisma.register.deleteMany()

    //     await prisma.student.deleteMany()
    //     await prisma.career.deleteMany()


    //     await prisma.course.deleteMany()
    //     await prisma.subscriptionRoom.deleteMany()
    //     await prisma.subscriptionModule.deleteMany()
    //     await prisma.room.deleteMany()
    //     await prisma.teacher.deleteMany()
    //     await prisma.module.deleteMany()
    //     await prisma.curricularStructure.deleteMany()

    //     console.log("TABLES HAVE BEEN REFRESHED")
    // } catch (error) {
    //     console.error(error)
    //     return
    // }

    // await prisma.user.create({
    //     data: {
    //         email: "developer@local.com",
    //         password: "Aa11223344@",
    //         username: "Developer D",
    //         role : "ADMIN"
    //     },
    // })
    // await prisma.user.create({
    //     data: {
    //         email: "super@local.com",
    //         password: "Aa11223344@",
    //         username: "Supervidor S.",
    //         role : "SUPERVISOR"
    //     },
    // })

    // const dataStudents: Prisma.StudentCreateInput [] = [
    //     {
    //         admision: "AGO 22",
    //         code: "AGO 22 - T",
    //         dateStart: new Date().toISOString(),
    //         dni: "12345678",
    //         fullName: "Diego Ordoñez Quilli",
    //         telephone: "987111222",
    //     },
    //     {
    //         admision: "AGO 22",
    //         code: "AGO 22 - T",
    //         dateStart: new Date().toISOString(),
    //         dni: "87654321",
    //         fullName: "Antonio Ordoñez Quilli",
    //         telephone: "987333222",
    //     },
    //     {
    //         admision: "FEB 22",
    //         code: "FEB 22 - T",
    //         dateStart: new Date().toISOString(),
    //         dni: "11223344",
    //         fullName: "Ronald Ordoñez Quilli",
    //         telephone: "987333222",
    //     },
    //     {
    //         admision: "FEB 22",
    //         code: "FEB 22 - T",
    //         dateStart: new Date().toISOString(),
    //         dni: "44332211",
    //         fullName: "Jesus Ordoñez Quilli",
    //         telephone: "987333222",
    //     },
    // ];

    // const students = await Promise.all(
    //     dataStudents.map(async (student) =>
    //         await prisma.student.create({
    //             data: student
    //         })
    //     )
    // );

    // //teachers
    // await prisma.teacher.createMany({
    //     data : [
    //         {  fullName : "Avendaño Rubin, Maria Teresa" , telephone : "952983323" , dni : "29568968" },
    //         {  fullName : "Avendaño Jihuallanga, Myla Antonieta" , telephone : "" , dni : "40238298" },
    //         {  fullName : "Basadrea Berrios, Lourdes Margarita" , telephone : "966007617" , dni : "43276677" },
    //         {  fullName : "Chambilla Mamani, Luis Martin" , telephone : "957042786" , dni : "46241666" },
    //         {  fullName : "Chino Alferez, Milagros" , telephone : "" , dni : "41110857" },
    //         {  fullName : "Espinoza Alvarez, Jorge Oliveiro" , telephone : "974277661" , dni : "41486069" },
    //         {  fullName : "Huanca Roque, Gino Elmer" , telephone : "974532178" , dni : "42951887" },
    //         {  fullName : "Jauregui Chavez, Eduardo" , telephone : "" , dni : "09435422" },
    //         {  fullName : "Mamani Llenera, Sergio Esteban" , telephone : "931851979" , dni : "41408904" },
    //         {  fullName : "Monroy Leon, Wilmer Santiago" , telephone : "952365846" , dni : "00421449" },
    //         {  fullName : "Palza Pari, Oswaldo Alberto" , telephone : "" , dni : "41525956" },
    //         {  fullName : "Rejas Bravos, Nelly Cristina" , telephone : "" , dni : "24003063" },
    //         {  fullName : "Rodriguez Lopez, Ana Cecilia Del Rosario" , telephone : "" , dni : "44124020" },
    //         {  fullName : "Rosas Chura, Evelyn Elsa" , telephone : "952212332" , dni : "46438150" },
    //         {  fullName : "Vascones Torres, Carlos Enrique" , telephone : "942900523" , dni : "40307315" },
    //         {  fullName : "Velarde Bermejo, Liz Samanta" , telephone : "" , dni : "47858121" },
    //         {  fullName : "Vidal Marquez, Virginia Marcela" , telephone : "953557787" , dni : "09232633" },
    //         {  fullName : "Vizcarra Copaja, Karla Macarena" , telephone : "" , dni : "70879991" },
    //         {  fullName : "Zapata Ormeño, Alejandra Valeria" , telephone : "" , dni : "45490712" },
    //     ]
    // })



    // const dataCareers : Prisma.CareerCreateInput[] = [
    //     {
    //         name : "Gastronomía",
    //         curricularStructures : {
    //             create : {
    //                 code : "MC-ENE-R-2022", year : "2022", isRegular : true, month: "ENERO"
    //             }
    //         }
    //     },
    //     {
    //         name : "Bar y Mixologia"
    //     },
    //     {
    //         name : "Hoteleria y Turismo"
    //     },
    //     {
    //         name : "Pasteleria y Panificacion"
    //     },
    // ]

    // const careers = await Promise.all(dataCareers.map(
    //     async(career) =>
    //         await prisma.career.create({
    //             data : career
    //         })
    // ))

    // const curricularGastronomia = await prisma.curricularStructure.findFirst({
    //     where : {
    //         career: {
    //             name : "Gastronomía"
    //         }
    //     },
    //     include : {
    //         modules : {
    //             include : {
    //                 courses : true
    //             }
    //         }
    //     }
    // })

    // const dataModulesGastronomia : Prisma.ModuleCreateInput[] = [
    //     {
    //         name : "MODULO 1",
    //         curricularStructure : {
    //             connect : { id : curricularGastronomia?.id }
    //         },
    //         courses : {
    //             createMany : {
    //                 data : [
    //                     { name : 'Fundamentos de la Cocina' , type : 'PRACTICO', sessions :12},
    //                     { name : 'Técnicas de Cocina: Cortes' , type : 'PRACTICO', sessions :12},
    //                     { name : 'Técnicas de Cocina: Carnes y Brasas' , type : 'PRACTICO', sessions :12},
    //                     { name : 'Técnicas de Cocina: Menudencias, Guisos y Pastas' , type : 'PRACTICO', sessions :12},
    //                     { name : 'Desarrollo Personal' , type : 'TEORICO', sessions :8},
    //                     { name : 'Investigación Gastronómica' , type : 'TEORICO', sessions :8},
    //                     { name : 'Matemática Básica' , type : 'TEORICO', sessions :8},
    //                     { name : 'Seguridad Alimentaria y Poes' , type : 'TEORICO', sessions :8},
    //                 ]
    //             }
    //         }
    //     },
    //     {
    //         name : "MODULO 2",
    //         curricularStructure : {
    //             connect : { id : curricularGastronomia?.id }
    //         },
    //         courses : {
    //             createMany : {
    //                 data : [
    //                     { name : 'Cocina Peruana del Sur',type : 'PRACTICO', sessions : 12},
    //                     { name : 'Cocina Peruana del Centro',type : 'PRACTICO', sessions : 12},
    //                     { name : 'Cocina Peruana del Norte',type : 'PRACTICO', sessions : 12},
    //                     { name : 'Técnicas de Panadería y Pastelería Básicas',type : 'PRACTICO', sessions : 12},
    //                     { name : 'Desarrollo Académico/Laboral',type : 'TEORICO', sessions : 8},
    //                     { name : 'Liderazgo y Trabajo en Equipo',type : 'TEORICO', sessions : 8},
    //                     { name : 'Compras y Almacén',type : 'TEORICO', sessions : 8},
    //                     { name : 'Seguridad y Prevención de Accidentes',type : 'TEORICO', sessions : 8},
    //                 ]
    //             }
    //         }
    //     }
    // ]

    // const modulesGastronomia = await Promise.all(
    //     await dataModulesGastronomia.map(async(dataModule) =>
    //         await prisma.module.create({
    //             data : dataModule
    //         })
    //     )
    // )

    // const completeCurricularGastronomia = await prisma.curricularStructure.findFirst({
    //     where : {
    //         career: {
    //             name : "Gastronomía"
    //         }
    //     },
    //     include : {
    //         modules : {
    //             include : {
    //                 courses : true
    //             }
    //         }
    //     }
    // })



    // let dataRoomsGastronomia : Prisma.RoomCreateInput[] = []

    // completeCurricularGastronomia?.modules.forEach(
    //     module => module.courses?.forEach(
    //         course =>
    //             {
    //                 dataRoomsGastronomia.push({
    //                     name: 'GA-FEBRERO-2022-M',
    //                     hourStart : "16:00",
    //                     hourEnd : "18:00",
    //                     dateStart: new Date().toISOString(),
    //                     dateEnd:  new Date().toISOString(),
    //                     course : {
    //                         connect : {
    //                             id : course.id
    //                         }
    //                     },
    //                     schedule : "MAÑANA",
    //                     frecuency : "LMIV"
    //                 })
    //             }
    //     )
    // )



    // const rooms = await Promise.all(
    //     dataRoomsGastronomia.map(async (room) =>
    //         await prisma.room.create({
    //             data: room
    //         })
    //     )
    // )

    const registers = await prisma.register.findMany({
        include : {
            curricular : {
                include : {
                    career : true
                }
            }
        }
    })

    // registers.forEach(register => {
    //     console.log(`${register?.curricular.career.name == "Barismo" ? "BRM" : register.curricular.career.name.substring(0,2).toUpperCase()}-${register.dateStart.toLocaleDateString('es-ES', { month: 'short'}).toUpperCase()}-${register.dateStart.getFullYear()}-${register.scheduleAdmision.substring(0,1)}`)
    // })

    // Promise.all(registers.map( async register => {
    //     await prisma.register.update({
    //         where : {
    //             id : register.id
    //         },
    //         data : {
    //             admision : `${register?.curricular.career.name == "Barismo" ? "BRM" : register.curricular.career.name.substring(0,2).toUpperCase()}-${register.dateStart.toLocaleDateString('es-ES', { month: 'short'}).toUpperCase()}-${register.dateStart.getFullYear()}-${register.scheduleAdmision.substring(0,1)}`
    //         }
    //     })
    // }))


    // GENERATED ALL ATTENDACES FOR COURSE

    // const subsRoom = await prisma.subscriptionRoom.findMany({
    //     include : {
    //         room : {
    //             include : {
    //                 course : true
    //             }

    //         }
    //     }
    // })
    // await Promise.all(
    //     subsRoom.map(async subRoom => {
    //         return await prisma.attendance.createMany({
    //             data : Array.from({length : subRoom.room.course.sessions}).map((_, i) => ({
    //                 subscriptionRoomId : subRoom.id,
    //                 date : DateTime.now().startOf('year').toJSDate(),
    //                 stateAttendance : "PENDIENTE",
    //                 observation : ""
    //             })) as Prisma.AttendanceCreateManyInput[]
    //         })
    //     })
    // )

    console.log("Seed is OK :)")
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
