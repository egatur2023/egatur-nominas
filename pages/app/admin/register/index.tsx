import API from "@api";
import { AssignmentInd, AssignmentTurnedIn, CloudDownload, DriveFileRenameOutline, NoteAlt, Print, RemoveRedEye, Topic, Visibility } from "@mui/icons-material";
import { Button, CircularProgress, Fade, IconButton, Stack, Tooltip, Typography } from "@mui/material";
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
import DialogEditObservationRegister from "resources/components/register/dialog.edit.observation";
import autoTable from 'jspdf-autotable'
import { hasPermission, urlContentToDataUri } from "resources/functions/helpers.frontend";
import { useSession } from "next-auth/react";

export default function Register() {
    const { data } = useSession()
    const filePDF = new jsPDF({
        format: "a4",
        unit: "px"
    })
    const { setOpenDialogRegister , setRegisterToEditObservation , setOpendialogEditObservation } = useStoreRegister()
    const router = useRouter()
    const [registerId , setRegisterId] = useState<number>(0)
    useQuery<DtoResRegisterWithSubRooms>(
        ["api/register/byid", registerId],
        async () => API.getRegisterById(registerId),
        {
            enabled: registerId > 0,
            onSuccess : async (register) => {
                var logoBase64 = await urlContentToDataUri("/logo.png")

                autoTable(filePDF,{
                    body: [
                      [{ content : '', styles : { minCellWidth : 160 } }, {content: 'Record Académico', styles: {halign: 'center'  , minCellHeight : 40 , fontSize : 32 , fontStyle : 'bold'}}],
                    ],
                    didDrawCell: (data) => {
                        if (data.section === 'body' && data.column.index === 0) {
                            filePDF.addImage(logoBase64 as string, 'PNG', data.cell.x + 2, data.cell.y + 2, 100, 30)
                          }
                    },
                    theme : 'plain',
                })

                autoTable(filePDF,{
                    body: [
                      [{ content : 'Nombres y Apellidos', }, {content: register.fullName, styles: {}}],
                      [{ content : 'Admisión', }, {content: register.dateAdmision, styles: {}}],
                      [{ content : 'Malla curricular', }, {content: register.scheduleAdmision, styles: {}}],
                    ],
                    theme : 'plain',
                })

                autoTable(filePDF,{
                    head : [[
                        {content : 'N°' , styles : { fillColor : "#0066bb" } },
                        { content : 'Curso' , styles : { fillColor : "#0066bb" , halign : 'center'} },
                        { content : 'Tipo' , styles : { fillColor : "#0066bb" , halign : 'center'} },
                        { content : 'Modulo' , styles : { fillColor : "#0066bb" , halign : 'center'} },
                        { content : 'Docente' , styles : { fillColor : "#0066bb" , halign : 'center'} },
                        { content : 'Fecha Inicio' , styles : { fillColor : "#0066bb" , halign : 'center'} },
                        { content : 'Fecha Fin' , styles : { fillColor : "#0066bb" , halign : 'center'} },
                        { content : 'Nota' , styles : { fillColor : "#0066bb" , halign : 'center'} },
                    ]],
                    body : register.subRooms.map((subR, index) => (
                        [
                            ++index,
                            subR.courseName,
                            subR.typeCourse,
                            subR.moduleName,
                            subR.teacherName,
                            subR.dateStart ,
                            subR.dateEnd,
                            subR.score,
                        ]
                    )),
                    theme : 'grid',
                })



                filePDF.save("registro_alumno.pdf")
                setRegisterId(0)
            },
        }
    )


    const handleOpen = () => {
        setOpenDialogRegister(true)
    }

    const handleEditObservation = (register: DtoResRegister) => {
        setRegisterToEditObservation(register)
        setOpendialogEditObservation(true)
    }

    const handleActionDetailRegister = (registerId: any) => {
        // console.log(registerId)
        router.push(`/app/admin/register/${registerId}`)
    }
    const handleActionEnrollment = (registerId: any) => {
        // console.log(registerId)
        router.push(`/app/admin/register/enrollment/${registerId}`)
    }

    const downloadPDF = (register : DtoResRegister) => {
        setRegisterId(register.id)
    }

    const handleGotToRegisterById = (registerId : number) => {
        router.push(`/app/admin/register/${registerId}`)
    }

    const { data: registers, isLoading } = useQuery<DtoResRegister[]>(["registers"], async () => API.getRegisters(),{
        initialData : []
    })

    const isAuthorizedForReadEnrollment = hasPermission(data?.user.role.permissions||[],'Matrícula.read')
    const isAuthorizedForReadRegister = hasPermission(data?.user.role.permissions||[],'Nominas.read')
    const isAuthorizedForUpdateRegister = hasPermission(data?.user.role.permissions||[],'Nominas.update')

    const columnHelper = createColumnHelper<DtoResRegister>()

    const columns : ColumnDef<DtoResRegister,any>[] = useMemo(()=> [
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
            header : "Fecha de matrícula",
            cell(props) {
                return DateTime.fromISO(props.getValue()).toUTC().toISODate()
            },
        }),
        columnHelper.accessor(() => null,{
            id : "Actions",
            header : "Acciones",
            enableGlobalFilter : false,
            cell(props) {

                return (
                    <Stack direction="row">

                        {
                            isAuthorizedForReadEnrollment &&
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
                        }
                        {
                            isAuthorizedForReadRegister &&
                            <Tooltip
                                title="Ver de malla"
                                placement="top"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 400 }}
                                arrow>
                                <IconButton size="large" onClick={() => handleActionDetailRegister(props.row.original.id)}>
                                    <RemoveRedEye fontSize="small" />
                                </IconButton>
                            </Tooltip>
                         }
                        <Tooltip
                            title="Descargar PDF"
                            placement="top"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 400 }}
                            arrow>
                            <IconButton size="large" onClick={() => downloadPDF(props.row.original) }>
                                <CloudDownload fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        {
                            isAuthorizedForUpdateRegister &&
                            <Tooltip
                                title="Editar observación"
                                placement="top"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 400 }}
                                arrow>
                                <IconButton size="large" onClick={() => handleEditObservation(props.row.original) }>
                                    <AssignmentTurnedIn fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        }


                    </Stack>
                )
            },
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ],[isAuthorizedForReadEnrollment])

    const isAuthorizedForCreate = hasPermission(data?.user.role.permissions||[],'Nominas.create')

    // if (isLoading) {
    //     return <Box
    //         display={"flex"}
    //         justifyContent={"center"}
    //         alignItems={"center"}
    //         height={"100vh"}
    //     >
    //         <CircularProgress></CircularProgress>
    //     </Box>
    // }

    return (
        <>
            <DialogCreateRegister />
            <DialogCreateStudent />
            <DialogEditRegister />
            <DialogEditObservationRegister />
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

                    {
                        isAuthorizedForCreate &&
                        <Button
                            variant="contained"
                            onClick={handleOpen}
                        >
                            Agregar Registro
                        </Button>
                    }
                </Box>

                <DataTable
                    //@ts-ignore
                    columns={columns}
                    data={registers}
                />
            </Box>

        </>)
}
