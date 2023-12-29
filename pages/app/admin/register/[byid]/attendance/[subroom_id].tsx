import API from "@api"
import { NoteAlt } from "@mui/icons-material"
import { Chip, IconButton } from "@mui/material"
import { Attendance } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { DateTime } from "luxon"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import AttendanceUpdate from "resources/components/attendance/attendance.update"
import DataTable from "resources/components/data.table"
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

    const { data: responseAttendance, isLoading } = useQuery<ResponseAttendancesBySubRoomId>(
        ["api/register/[register_id]/attendance/[subroom_id]", subRoomId],
        async () => API.fetchGetAttendancesBySubRoomId(registerId,subRoomId),
        {
            enabled: subRoomId > 0 && registerId > 0,
        }
    )
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
                header : "Observación"
            }),
            columnHelper.accessor(() => null,{
                id : "Edit",
                header :"Acciones",
                enableColumnFilter : false,
                enableGlobalFilter : false,
                cell(props) {
                    return (
                        <IconButton
                            color="primary"
                            onClick={()=> {
                                setAttendanceToEdit(props.row.original)
                                setOpenDialogEditAttendance(true)
                        }}>
                            <NoteAlt fontSize="small"/>
                        </IconButton>
                    )
                },
            })

        ],
        []
    )

    const handleIsOpen = (isOpen : boolean) => {
        setOpenDialogEditAttendance(isOpen)
        setAttendanceToEdit(null)
    }


    return (
        <>
        <DataTable
            //@ts-ignore
            columns={columns}
            data={ responseAttendance?.attendances || []}
        />

        <AttendanceUpdate attendance={attendance} handleIsOpen={handleIsOpen} isOpen={isOpenDialogEditAttendance} />
        </>
    )
}
