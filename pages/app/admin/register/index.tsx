import API from "@api";
import { AssignmentInd, DriveFileRenameOutline, Print, Topic } from "@mui/icons-material";
import { Button, CircularProgress, Fade, IconButton, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useQuery } from '@tanstack/react-query';
import DialogCreateRegister from "resources/components/register/dialog.create";
import DialogCreateStudent from "resources/components/student/dialog.create";
import jsPDF from "jspdf";
import {renderToStaticMarkup} from 'react-dom/server'
import { TemplateRegistersPDF } from "resources/components/pdf/template.registers";
import { useState } from "react";
import { DtoResRegister, DtoResRegisterSubRoom, DtoResRegisterWithSubRooms } from "resources/types";
import DialogEditRegister from "resources/components/register/dialog.edit";
import { DateTime } from "luxon";
import DataTable from "resources/components/data.table";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { useStoreRegister } from "resources/local/store.register";

export default function Register() {

    const filePDF = new jsPDF({
        format: "a4",
        unit: "px"
    })
    const { setOpenDialogEditRegister, setOpenDialogRegister, setRegisterToEdit } = useStoreRegister()
    const router = useRouter()
    const [registerId , setRegisterId] = useState<number>(0)
    useQuery<DtoResRegisterWithSubRooms>(
        ["api/register/byid", registerId],
        async () => API.getRegisterById(registerId),
        {
            enabled: registerId > 0,
            onSuccess(data) {
                filePDF.setFontSize(1)
                filePDF.html(renderToStaticMarkup(<TemplateRegistersPDF register={data}/>),{
                    margin:  [20,20,20,20] ,
                    callback : () => {
                        filePDF.save("registro_alumno.pdf")
                    }
                })
                setRegisterId(0)
            },
        }
    )


    const handleOpen = () => {
        setOpenDialogRegister(true)
    }

    const handleActionDetailRegister = (registerId: any) => {
        console.log(registerId)
        router.push(`/app/admin/register/${registerId}`)
    }
    const handleActionEnrollment = (registerId: any) => {
        console.log(registerId)
        router.push(`/app/admin/register/enrollment/${registerId}`)
    }

    const downloadPDF = (register : DtoResRegister) => {
        setRegisterId(register.id)
    }

    const { data: registers, isLoading } = useQuery<DtoResRegister[]>(["registers"], async () => API.getRegisters(),{
        initialData : []
    })

    const columnHelper = createColumnHelper<DtoResRegister>()
    //@ts-ignore
    const columns : ColumnDef<DtoResRegister>[] = useMemo(()=> [
        columnHelper.accessor((_,index)=> ++index,{
            header : "N°"
        }),
        columnHelper.accessor("fullName",{
            header : "Nombres y Apellidos"
        }),
        columnHelper.accessor("dateAdmision",{
            header : "Admisión"
        }),
        columnHelper.accessor("scheduleAdmision",{
            header : "Turno"
        }),
        columnHelper.accessor("curricularName",{
            header : "Curricula"
        }),
        columnHelper.accessor("dateStart",{
            header : "Fecha Inicio",
            cell(props) {
                return DateTime.fromISO(props.getValue()).toUTC().toISODate()
            },
        }),
        columnHelper.accessor("dateEnd",{
            header : "Fecha Término",
            cell(props) {
                return props.getValue() != "" ? DateTime.fromISO(props.getValue()).toUTC().toISODate() : props.getValue()
            },
        }),
        columnHelper.accessor(()=> 0,{
            id : "Actions",
            header : "Acciones",
            enableGlobalFilter : false,
            cell(props) {
                return (
                    <Box>
                        <Tooltip
                            title="Asignar Curso"
                            placement="top"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 400 }}
                            arrow>
                            <IconButton sx={{ ml: 2 }} size="large" onClick={() => handleActionEnrollment(props.row.original.id)}>
                                <Topic fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip
                            title="Editar de Malla"
                            placement="top"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 400 }}
                            arrow>
                            <IconButton size="large" onClick={() => handleActionDetailRegister(props.row.original.id)}>
                                <DriveFileRenameOutline fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title="Descargar PDF"
                            placement="top"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 400 }}
                            arrow>
                            <IconButton size="large" onClick={() => downloadPDF(props.row.original) }>
                                <Print fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )
            },
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ],[])

    if (isLoading) {
        return <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"100vh"}
        >
            <CircularProgress></CircularProgress>
        </Box>
    }

    return (
        <>
            <DialogCreateRegister />
            <DialogCreateStudent />
            <DialogEditRegister />
            <Box
                marginTop={"2rem"}
                marginX={"2rem"}
            >

                <Box
                    marginBottom={"2rem"}
                    display={"flex"}
                    justifyContent={"space-between"}
                >
                    <Typography
                        variant="h5"
                        fontWeight={"bold"}
                    >
                        Registros de Alumnos
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={handleOpen}
                    >
                        Agregar Registro
                    </Button>
                </Box>

                <DataTable
                    //@ts-ignore
                    columns={columns}
                    data={registers}
                />
            </Box>

        </>)
}
