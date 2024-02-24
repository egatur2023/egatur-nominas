import { MonthEnum } from "prisma/prisma-client";
import { ScheduleType, WeekDays } from "./types";
export const MONTHS: MonthEnum[] = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]
export const SCHEDULES : ScheduleType[] = ["MAÑANA", "TARDE", "NOCHE"]
export const WEEKDAYS : WeekDays[] = [
        { name : "LUNES" , position : 0 , abbrevation :  "L"},
        { name : "MARTES" , position : 1 , abbrevation :  "M"},
        {name : "MIERCOLES" , position : 2 , abbrevation :  "MI"},
        {name : "JUEVES" , position : 3 , abbrevation :  "J"},
        {name : "VIERNES" , position : 4 , abbrevation :  "V"},
        {name : "SABADO" , position : 5 , abbrevation :  "S"},
        {name : "DOMINGO" , position : 6 , abbrevation :"D"},
    ]

export const UI = {
    PDF : {
        maxWdith : {
            portrait : "107mm",
            landscape : "158mm"
        }
    }
}


export const MODULES = {
    Módulos  : 'Módulos',
    Usuarios  : 'Usuarios',
    Solicitudes  : 'Solicitudes',
    Malla_Curricular  : 'Malla Curricular',
    Nominas  : 'Nominas',
    Docentes  : 'Docentes',
    'Admisiones/Asistencias'  : 'Admisiones/Asistencias',
    Roles  : 'Roles',
    Reporte_General  : 'Reporte General',
    Matrícula  : 'Matrícula',
    Aulas  : 'Aulas',
}
