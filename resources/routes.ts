import { AreaSidebar } from "./local/store.sidebar"
export const prefixSystem = '/app'
export const itemsSidebarAdmin : AreaSidebar[] =
    [
        {
            name : 'Recursos',
            groups : [
                {
                    name : 'Malla Curricular',
                    title : 'Lista de carreras',
                    path : '/app/admin/career',
                },
                {
                    name : 'Nominas',
                    title : 'Registro por alumno',
                    path : '/app/admin/register',
                },
                {
                    name : 'Docentes',
                    title : 'Lista de Docentes',
                    path : '/app/admin/teacher',
                },
                {
                    name : 'Solicitudes',
                    title : 'Solicitudes de cambio de nota',
                    path : '/app/admin/request',
                },
                // {
                //     name : 'Admisiones',
                //     title : 'Admisiones2',
                //     path : '/app/admin/admission',
                // },
            ]

        },
        {
            name : 'Reportes',
            groups : [
                {
                    name : 'Reporte General',
                    title : 'Reporte de General',
                    path : '/app/admin/report'
                },
            ]
        },
]

export const itemsSidebarSupervisor : AreaSidebar[] =
    [
        {
            name : 'Recursos',
            groups : [
                {
                    name : 'Solicitudes',
                    title : 'Solicitudes de cambio de nota',
                    path : '/app/super/request',
                },
                {
                    name : 'Nominas',
                    title : 'Nominas',
                    path : '/app/super/register',
                },
            ]

        },
]

