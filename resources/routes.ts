import { MODULES } from "./constants"
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
                    permissions : 'Malla Curricular.read'
                },
                {
                    name : 'Nominas',
                    title : 'Registro por alumno',
                    path : '/app/admin/register',
                    permissions : 'Nominas.read'
                },
                {
                    name : 'Docentes',
                    title : 'Lista de Docentes',
                    path : '/app/admin/teacher',
                    permissions : 'Docentes.read'
                },
                {
                    name : 'Solicitudes',
                    title : 'Solicitudes de cambio de nota',
                    path : '/app/admin/request',
                    permissions : 'Solicitudes.read'
                },
                {
                    name : 'Admisiones',
                    title : 'Admisiones2',
                    path : '/app/admin/admission',
                    permissions : 'Admisiones.read'
                },
                {
                    name : 'Roles',
                    title : 'Roles',
                    path : '/app/admin/role',
                    permissions : 'Roles.read'
                },
                {
                    name : 'Modulos',
                    title : 'Modulos',
                    path : '/app/admin/ms',
                    permissions : 'Módulos.read'
                },
                {
                    name : 'Usuarios',
                    title : 'suarios',
                    path : '/app/admin/user',
                    permissions : 'Usuarios.read'
                },
                {
                    name : 'Solicitudes',
                    title : 'Solicitudes de cambio de nota',
                    path : '/app/admin/request',
                    permissions : 'Solicitudes.read'
                },
                // {
                //     name : 'Nominas',
                //     title : 'Nominas',
                //     path : '/app/super/register',
                //     permissions : 'Nominas.read'
                // },
            ]

        },
        {
            name : 'Reportes',
            groups : [
                {
                    name : 'Reporte General',
                    title : 'Reporte de General',
                    path : '/app/admin/report',
                    permissions : 'Reporte General.read'
                },
            ]
        },
]

// export const itemsSidebarSupervisor : AreaSidebar[] =
//     [
//         {
//             name : 'Recursos',
//             groups : [
//                 {
//                     name : 'Solicitudes',
//                     title : 'Solicitudes de cambio de nota',
//                     path : '/app/super/request',
//                 },
//                 {
//                     name : 'Nominas',
//                     title : 'Nominas',
//                     path : '/app/super/register',
//                 },
//             ]

//         },
// ]

// export const itemsSidebarAdvisor : AreaSidebar[] =
//     [
//         {
//             name : 'Recursos',
//             groups : [
//                 {
//                     name : 'Solicitudes',
//                     title : 'Solicitudes de cambio de nota',
//                     path : '/app/super/request',
//                 },
//                 {
//                     name : 'Nominas',
//                     title : 'Nominas',
//                     path : '/app/super/register',
//                 },
//             ]

//         },
//         {
//             name : 'Reportes',
//             groups : [
//                 {
//                     name : 'Reporte General',
//                     title : 'Reporte de General',
//                     path : '/app/admin/report'
//                 },
//             ]
//         },
// ]

