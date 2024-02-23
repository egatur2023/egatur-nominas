import { Room, StateUpdate, TypeUser } from "@prisma/client"
import { Prisma } from "prisma/prisma-client"
import getCoursesByModuleId from "./services/course"
import { getRequestForAdmin } from "./services/request"
import getRoomsByCourseId from "./services/room"
import { getAttendancesBySubscriptionRoomId } from "./services/attendance/getAttendancesBySubscriptionRoomId"
import { getCourseBySubModuleIdAndName } from "./services/course/getCourseBySubModuleIdAndName"
import { getSubscriptionRoomById } from "./services/subroom/getSubscriptionRoomById"
import { getAdmissionsByAdmission } from "./services/subroom/getRoomsByCareer"
import { executeQueryGetSubsRoomByAdmission, getSubscriptionsRoomByAdmission } from "./services/subroom/getSubscriptionsRoomByRoomId"
import { getRoles } from "./services/role/list"
import { getUsers } from "./services/user/list"
import { getSubscriptionsRoomReportByAdmission } from "./services/attendance/getSubscriptionsRoomReportByAdmission"
import loginUseCase from "./services/login.use.case"


export type DtoCreateRequest = {
    reason : string
    userId : number
    subRoomId : number
    date : any
    doc1 : DocumentRequest
    doc2 : DocumentRequest
    doc3 : DocumentRequest
}

export type DocumentRequest = {
    name : string
    extension : string
}
export type UploadedDocument = {
    name : string
    extension : string
    id : string
}

export declare type DtoCreateCourse = {
    name : string
    type        : CourseType
    moduleId    : number
    sessions    : number
}

export declare type DtoCreateRegister = {
    careerId : number
    studentId : number
    curricularId : number
    dateStart : string
    scheduleAdmision : ScheduleType
}
export declare type DtoCreateRoom = {
    name : string
    courseId : number
    teacherId : number
    dateStart : string
    dateEnd : string
    hourStart: string
    hourEnd: string
    schedule : ScheduleType
    frecuency : string
    section: string
}


export declare type DtoCreateSubModuleWithRooms = {
    registerId : number
    toEnrollSubModules : DtoCreateSubModule[]
}

export declare type DtoCreateSubModule = {
    moduleId : number
    toEnrollSubRooms : DtoCreateSubRoom[]
}

export declare type DtoCreateSubRoom = {
    courseName : string
    roomId : number
}

export declare type DtoUpdateAttendance = {
    attendanceId : number,
    date : string,
    stateAttendance : AttendanceState,
    observation : string
}
export declare type DtoUpdateRegister = {
    registerId : number
    observation : string
}

export declare type ScheduleType  = "MAÑANA" |  "TARDE" | "NOCHE" | "VACIO"
export declare type ModuleType  = "TRANSVERSAL" |  "TECNICO"
export declare type CourseType = "TEORICO" | "PRACTICO" | "TEORICO / PRACTICO"

const months: MonthEnum[] = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]

// DATA TRANSFER OBJECTS
export declare type DtoCreateCareer = {
    name : string
}
export declare type DtoCreateCurricular = {
    year : string
    month: MonthEnum
    isRegular : boolean
    careerId : number
}
export declare type DtoCreateModule = {
    name : string
    curricularId : number
}
export declare type DtoCreateTeacher = {
    fullName : string
    dni : string
    telephone : string
}

export declare type TeacherToEdit = {
    id : number
    dni: string
    fullName: string
    telephone: string
}


export declare type DtoEditTeacher = {
    id: number
    fullName : string
    dni : string
    telephone : string
}

export declare type DtoCreateStudent = {
    code : string
    fullName : string
    dni : string
    telephone : string
    dateStart : string
    admision : string
}

export declare type DtoCreateTeacher = {
    fullName : string
    dni : string
    telephone : string
}

export declare type DtoEditTeacher = {
    id: number
    fullName : string
    dni : string
    telephone : string
}

//EDIT TYPE

export declare type DtoEditRequestAdmin = {
    requestId : number
    observation : string
    stateUpdate : StateUpdate
}
export declare type DtoEditRequestSuper = {
    requestId : number
    reason : string
    doc1 : UploadedDocument
    doc2 : UploadedDocument
    doc3 : UploadedDocument
}
export declare type DtoEditCourse = {
    id : number
    name : string
    type : CourseType | string
    dateStart : string
    dateEnd : string
    sessions : number
    schedule : ScheduleType
    careerName : string
    curricularCode : string
    moduleName : string
}

export declare type DtoEditRoom = {
    id : number
    name : string
    teacherId : number
    dateStart : string
    dateEnd : string
    hourStart: string
    hourEnd: string
    schedule : ScheduleType
    frecuency : string
    section: string
}

export declare type DtoEditCareer = {
    id : number
    name : string
}

export declare type DtoEditModule = {
    id : number
    name : string
}

export declare type DtoEditCurricular = {
    id : number
    code : string
    year : string
    month: MonthEnum
    isRegular : boolean
    careerName? : string
}

//cambiar nombre a DtoEditRoomIdSubCourse
export declare type DtoEditSubRoom = {
    subRoomId : number //cambiar  subscriptionCourseId => id
    roomId : number
}
export declare type DtoEditSubRoomNameAndScore = {
    id : number
    score : number
    courseName : string
}

export declare type DtoEditCourseName = {
    id : number
    name : string
}

export declare type DtoEditRegister = {
    registerId : number
    dateStart : string
    dateEnd : string
}

export declare type CareerToEdit = {
    id : number
    name : string
}

export declare type TeacherToEdit = {
    id : number
    dni: string
    fullName: string
    telephone: string
}

//FILTERS DTO
export type DtoFilterReport = {
    careerId : number
    curricularId : number
    admision : string
    dateStart : string
    dateEnd : string
}
export type DtoFilterAdmissions = {
    // careerId : number
    careerName : string
    year : string
    month : string
    schedule : string
}

export type DtoFilterAttendance = {
    careerId: number
    dateStart : string
    dateEnd : string
}

export type DtoResponseReport = {
    studentFullName : string
    admision : string
    schedule : string
    careerName : string
    curricularName : string
    moduleName : string
    courseName : string
    teacherFullName : string
    score : number
}


// RESPONSES DTO
export type DtoResRegisterWithSubRooms = {
    id : number ,
    fullName : string ,
    scheduleAdmision : string ,
    dateAdmision : string ,
    subRooms : DtoResRegisterSubRoom[]
}


export type DtoResRegisterSubRoom = {
    subRoomId : number
    courseName : string
    typeCourse : string
    moduleName : string
    teacherName : string
    dateStart : string
    dateEnd : string
    score : number
    quantityUpdated : number
}

export type DtoResRegister = {
    id : number
    fullName : string
    dateAdmision : string
    careerName : string
    curricularName : string
    dateStart : string
    dateEnd : string
    scheduleAdmision : string
    observation : string
}

export type DtoDataReportRow = {
    studentFullName : string
    admision : string
    schedule : string
    careerName : string
    curricularName : string
    moduleName : string
    courseName : string
    teacherFullName : string
    score : number
}

export type DtoResRegisterRowCourse = {
    subscriptionCourseId : number
    courseName : string
    typeCourse : string
    moduleName : string
    teacherName : string
    dateStart: Date
    dateEnd: Date
    score: number
    rooms : Room[]
    roomId: number
    courseId : number
    roomName : string
}

export type DtoResRequestsForAdmin = {
    requestId : number
    dateRequest : string
    student : string
    userName : string
    courseName : string
    stateUpdate : StateUpdate
    observation : string
    documents : string
    reason : string
    score : number
    curricularName : string
    registerId : number
    subRoomId : number
}
export type DtoResRequestsForSuper = {
    requestId : number
    dateRequest : string
    student : string
    userName : string
    courseName : string
    stateRequest : StateUpdate
    observation : string
    documents : string
    reason : string
    score : number
    curricularName : string
    registerId : number
    subRoomId : number
}

export type DtoCreateModuleSystem = {
    name : string
}

export type DtoCreateRole = {
    name : TypeUser
}

export type ResponseAttendancesBySubRoomId = {
    courseName: string
    teacherFullName: string
    studentFullname: string
    dateAdmision: string
    schedule: string
    attendances: Attendance[]
}

// EXTENDED TYPES PRISMA

export type ResultRole = {
    permissions: {
        id: number;
        roleId: number;
        moduleId: number;
        action: $Enums.ActionPermission;
    }[];
} & {
    id: number;
    name: $Enums.TypeUser;
}

type UserWithRole = User & { role : Role }

export type RegisterWithRelations1 = Prisma.PromiseReturnType<typeof getRegisterWithRelations1>
export type RoomsByCourseId1 = Prisma.PromiseReturnType<typeof getRoomsByCourseId>
export type CoursesByModuleId1 = Prisma.PromiseReturnType<typeof getCoursesByModuleId>
export type RequestsForAdmin = Prisma.PromiseReturnType<typeof getRequestForAdmin>
export type ResultGetAttendancesBySubscriptionRoomId = Prisma.PromiseReturnType<typeof getAttendancesBySubscriptionRoomId>
export type ResultGetCourseBySubModuleIdAndName = Prisma.PromiseReturnType<typeof getCourseBySubModuleIdAndName>
export type ResultGetSubscriptionRoomById = Prisma.PromiseReturnType<typeof getSubscriptionRoomById>
export type ResultGetAdmissionsByAdmission = Prisma.PromiseReturnType<typeof getAdmissionsByAdmission>
export type ResultGetSubscriptionsRoomByAdmission = Prisma.PromiseReturnType<typeof getSubscriptionsRoomByAdmission>
export type ResultGetRoles = Prisma.PromiseReturnType<typeof getRoles>
export type ResultGetUsers = Prisma.PromiseReturnType<typeof getUsers>
export type TypeResultSubs = Prisma.PromiseReturnType<typeof executeQueryGetSubsRoomByAdmission>
export type ResultSubsRoomReportByAdmission = Prisma.PromiseReturnType<typeof getSubscriptionsRoomReportByAdmission>
export type GroupedResult = Record<string,{studentFullName : string , courses : TypeResultSubs }>
export type ResultLoginUseCase = Prisma.PromiseReturnType<typeof loginUseCase>

//const type

type WeekDays = {
    name : string
    position : number
    abbrevation : string
}


type MODULE_VALUES = 'Módulos.create'|'Módulos.read' | 'Módulos.update'| 'Módulos.delete'|
'Usuarios.create'|'Usuarios.read' |'Usuarios.update' | 'Usuarios.delete'|
'Solicitudes.create'| 'Solicitudes.read'| 'Solicitudes.update' | 'Solicitudes.delete'|
'Malla Curricular.create'|'Malla Curricular.read' |'Malla Curricular.update'|'Malla Curricular.delete'|
'Nominas.create'| 'Nominas.read'| 'Nominas.update'| 'Nominas.delete'|
'Docentes.create'|'Docentes.read' | 'Docentes.update'| 'Docentes.delete'|
'Admisiones.create'| 'Admisiones.read' | 'Admisiones.update' |'Admisiones.delete'|
'Roles.create' | 'Roles.read'| 'Roles.update' | 'Roles.delete'|
'Reporte General.create'| 'Reporte General.read'| 'Reporte General.update'|  'Reporte General.delete'|
'Matrícula.create'| 'Matrícula.read'| 'Matrícula.update'|  'Matrícula.delete'|
'Aulas.create'| 'Aulas.read'| 'Aulas.update'|  'Aulas.delete';
