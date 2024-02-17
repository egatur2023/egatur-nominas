import API from "@api"
import { FileDownload, NavigateNext, NoteAlt } from "@mui/icons-material"
import { Box, Breadcrumbs, Button, Chip, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material"
import { Attendance } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { DateTime } from "luxon"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import AttendanceUpdate from "resources/components/attendance/attendance.update"
import DataTable from "resources/components/data.table"
import { hasPermission } from "resources/functions/helpers.frontend"
import { useStoreAttendanceStudent } from "resources/local/store.attendance.student"
import { ResponseAttendancesBySubRoomId } from "resources/types"

/*
    Muestra las asistencias de un alumno Y de su curso X
    puede editar segun la leyenda
        [
            A : ASISTIÓ,
            F : FALTÓ,
            T : TARDANZA,
            J : JUSTIFICADA,
            NVD : NO VINO EL DOCENTE,
            FE : FERIADO
        ]
*/
export default function AttendanceBySubscriptionRoomPage(){

    const router = useRouter()
    const { data : session } = useSession()
    const registerId = parseInt(router.query.byid as string) || 0
    const subRoomId = parseInt(router.query.subroom_id as string) || 0
    const { setOpenDialogEditAttendance , setAttendanceToEdit , isOpenDialogEditAttendance , attendance } = useStoreAttendanceStudent()
    const colorsByState : {
        [key : string] :"default"|"primary" | "warning" | "secondary" | "error" | "success" | "info"
    } = {
        "PENDIENTE" : "default",
        "ASISTIO" : "primary",
        "FALTO" : "warning",
        "TARDANZA" : "secondary",
        "JUSTIFICADA" : "error",
        "NO_VINO_EL_DOCENTE" : "success",
        "FERIADO" : "info",
    }

    const getColorByState = useMemo(()=>{
        return (state : string) => {
            const states : {[key : string] : string} = {
                "PENDIENTE" : "#dedede",
                "ASISTIO" : "#3f50b5",
                "FALTO" : "#ffa726",
                "TARDANZA" : "#388e3c",
                "JUSTIFICADA" : "#f44336",
                "NO_VINO_EL_DOCENTE" : "#66bb6a",
                "FERIADO" : "#0288d1",
            }
            return states[state]
        }
    },[])

    const getAbbreviature = useMemo(()=>{
        return (state : string) => {
            const states : {[key : string] : string} = {
                "PENDIENTE" : "P",
                "ASISTIO" : "A",
                "FALTO" : "F",
                "TARDANZA" : "T",
                "JUSTIFICADA" : "J",
                "NO_VINO_EL_DOCENTE" : "NVD",
                "FERIADO" : "FE",
            }
            return states[state]
        }
    },[])

    const { data: responseAttendance } = useQuery<ResponseAttendancesBySubRoomId,any,ResponseAttendancesBySubRoomId,any>(
        {
            queryKey : ["api/register/[register_id]/attendance/[subroom_id]",subRoomId],
            queryFn : async () => await API.fetchGetAttendancesBySubRoomId(registerId,subRoomId),
            enabled: subRoomId > 0 && registerId > 0,
            initialData :  {
                studentFullname: "",
                dateAdmision: "",
                schedule: "",
                attendances: []
            }
        }
    )

    const isAuthoriedForUpdateAssistance = hasPermission(session?.user?.role?.permissions || [], "Admisiones.update")

    const columnHelper = createColumnHelper<Attendance>()
    const columns : ColumnDef<Attendance,any>[] = useMemo(()=>
        [
            columnHelper.accessor((_,index) => ++index,{
                header :"Sesión",
                enableGlobalFilter : false
            }),
            columnHelper.accessor("date",{
                header : "Fecha",
                cell(props) {
                    return DateTime.fromISO(props.getValue()).toUTC().toISODate()
                },
            }),
            columnHelper.accessor("stateAttendance",{
                header : "Estado",
                cell(props) {
                    const state : string = props.getValue() as string
                    return <Chip label={state} variant={"NO_VINO_EL_DOCENTE" == state || "FERIADO" == state ? 'outlined' : 'filled'} color={colorsByState[state] }/>
                },
            }),
            columnHelper.accessor("observation",{
                header : "Observación",
                cell(props) {
                    return props.getValue().length > 0 ? `${String(props.getValue()).substring(0,10)}...` : ""
                },
            }),
            columnHelper.accessor(() => null,{
                id : "Edit",
                header :"Acciones",
                enableColumnFilter : false,
                enableGlobalFilter : false,
                cell(props) {
                    return (
                        isAuthoriedForUpdateAssistance &&
                            <Tooltip
                            title="Editar"
                            placement="top"
                        >
                            <IconButton
                                color="primary"
                                onClick={()=> {
                                    setAttendanceToEdit(props.row.original)
                                    setOpenDialogEditAttendance(true)
                            }}>
                                <NoteAlt fontSize="small"/>
                            </IconButton>
                        </Tooltip>

                    )
                },
            })

        ],
        [isAuthoriedForUpdateAssistance]
    )

    const pdf = (
        new jsPDF({
            format: "A4",
            unit: "mm",
            orientation: "portrait",
        })
    )

    const handleIsOpen = (isOpen : boolean) => {
        setOpenDialogEditAttendance(isOpen)
        setAttendanceToEdit(null)
    }


    const handleDownloadReportAssistance = () => {
        autoTable(pdf,{
            theme: "plain",
            styles : { fontSize : 12, halign : "center"},
            head : [[`Reporte de asistencia`]],
        })

        autoTable(pdf,{
            theme: "plain",
            styles : { fontSize : 8},
            body : [
                [`ALUMNO`,`: ${responseAttendance?.studentFullname}`],
                [`CURSO`,`: ${responseAttendance?.courseName}`],
                [`DOCENTE`,`: ${responseAttendance?.teacherFullName}`],
            ],
        })

        autoTable(pdf,{
            showHead: 'everyPage',
            styles : { fontSize : 7, lineColor : [0,0,0], lineWidth : 0.1 ,fillColor : [255,255,255],textColor : [0,0,0]},
            margin :  { top : 10},
            theme : "grid",
            head : [
                [{ content : responseAttendance?.courseName , colSpan : responseAttendance?.attendances.length}],
                responseAttendance != undefined ? responseAttendance.attendances
                    .map(at =>
                        ({
                            content : new Date(at.date).toLocaleDateString('es-ES',{year : 'numeric', month : 'numeric', day : 'numeric'}),
                            styles : { halign : "center" }
                        })
                    ) : []
            ],
            body : [
                responseAttendance != undefined ? responseAttendance.attendances.map(at => ({
                    content : getAbbreviature(at.stateAttendance),
                    styles : { fillColor : getColorByState(at.stateAttendance) , halign : "center"}
                })) : []
            ]
        })
        pdf.save(`report_admission_${responseAttendance != undefined ? responseAttendance.courseName : "_x_"}.pdf`)
    }

    return (
        <Stack>
        <Breadcrumbs
            sx={{ mb : 4 }}
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
            >
            <Typography color="text.secondary">
                Asistencia
            </Typography>
            <Typography
                color="text.secondary"
            >
            {responseAttendance?.studentFullname}
            </Typography>
            <Typography color="text.primary">
            {responseAttendance?.courseName}
            </Typography>
        </Breadcrumbs>
        <Stack direction="row" spacing={2} justifyContent="flex-end" marginBottom={4}>
            <Button variant="outlined" endIcon={<FileDownload/>} onClick={() => handleDownloadReportAssistance()}>
                Descargar PDF
            </Button>
        </Stack>
        <DataTable
            //@ts-ignore
            columns={columns}
            data={ responseAttendance?.attendances || []}
        />

        <AttendanceUpdate attendance={attendance} handleIsOpen={handleIsOpen} isOpen={isOpenDialogEditAttendance} />
        </Stack>
    )
}
