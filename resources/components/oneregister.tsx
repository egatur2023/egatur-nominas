import { CircularProgress, Fade, IconButton, Stack, TextField,Tooltip } from "@mui/material";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from "@api";
import { DtoResRegisterSubRoom, DtoResRegisterWithSubRooms } from "resources/types";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Check, Close, Edit, ViewList , NoteAlt, Checkroom, FormatListNumbered } from "@mui/icons-material";
import * as yup from 'yup'
import { useRouter } from "next/router";
import DataTable from "./data.table";
import { useStoreRequest } from "resources/local/store.request";
import DialogCreateRequest from "./request/dialog.create";
import { useSession } from "next-auth/react"
import { hasPermission } from "resources/functions/helpers.frontend";

export default function OneRegister({register} : {register : DtoResRegisterWithSubRooms | undefined }) {

    const router = useRouter()
    const { data } = useSession()
    const { setIsOpenDialogCreate , setSubRoomId  } = useStoreRequest()
    const subRoomId = parseInt(String(router.query.subroomid)) || 0
    const qc = useQueryClient()
    const [isFocusName , setIsFocusName] = useState<boolean>(false)
    const [courseEdit, setCourseEdit] = useState<DtoResRegisterSubRoom|null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const mutation = useMutation(API.putSubRoomNameAndScore, {
        onSuccess: (updatedCourseName) => {
            setIsSubmitting(false)
            setCourseEdit(null)
            qc.invalidateQueries(["api/register/byid",register?.id])
        },
        onError: (error) => {
            setIsSubmitting(false)
            console.log(error)
        }
    })

    const handleSubmit = () => {
        const schema = yup.object().shape({
            id : yup.number().required(),
            courseName : yup.string().required(),
            score : yup.number().integer().min(0).max(20)
        })
        let _subRoomEdit = { id : courseEdit?.subRoomId || 0 , courseName : courseEdit?.courseName || "", score : courseEdit?.score || 0}
        let validatedSubRoom = schema.isValidSync(_subRoomEdit)
        if(validatedSubRoom){
            mutation.mutate(_subRoomEdit)
            setIsSubmitting(true)
        }
    }

    const isAuthoriedForReadAssistance = hasPermission(data?.user?.role?.permissions || [], "Admisiones.read")
    const isAuthoriedForCreateRequest = hasPermission(data?.user?.role?.permissions || [], "Solicitudes.create")
    const isAuthoriedForUpdateRegister = hasPermission(data?.user?.role?.permissions || [], "Nominas.update")

    const columnHelper = createColumnHelper<DtoResRegisterSubRoom>()
    const columns : ColumnDef<DtoResRegisterSubRoom,any>[] = useMemo(()=>
        [
            columnHelper.accessor((row,index) => ++index,{
                header :"N°",
                enableGlobalFilter : false,
            }),
            columnHelper.accessor("courseName",{
                id : "courseName",
                header :"Curso",
                enableGlobalFilter : true,
                cell(props) {
                    return  courseEdit && courseEdit?.subRoomId === props.row.original.subRoomId ?
                    <TextField
                        autoFocus={isFocusName}
                        fullWidth
                        size="small"
                        variant="outlined"
                        onClick={(e) => setIsFocusName(true)}
                        value={courseEdit?.courseName}
                        onChange={(e) => setCourseEdit({...courseEdit , courseName : String(e.target.value) || ""})}
                    />
                    : props.getValue()
                },
            }),
            columnHelper.accessor("typeCourse",{
                header :"Tipo",
                enableGlobalFilter : true,
            }),
            columnHelper.accessor("moduleName",{
                header :"Module",
                enableGlobalFilter : true,
                // sortingFn : fuzzySort,
            }),
            columnHelper.accessor("teacherName",{
                header :"Docente",
                enableGlobalFilter : true,
            }),
            columnHelper.accessor("dateStart",{
                header :"Fecha Inicio",
                enableGlobalFilter : true,
            }),
            columnHelper.accessor("dateEnd",{
                header :"Fecha Fin",
                enableGlobalFilter : true,
            }),
            columnHelper.accessor("score",{
                header :"Nota",
                enableColumnFilter : true,
                enableGlobalFilter : true,
                cell(props) {
                    return courseEdit && courseEdit?.subRoomId == props.row.original.subRoomId ? (
                        <TextField
                                autoFocus={!isFocusName}
                                fullWidth
                                variant="outlined"
                                type="text"
                                size="small"
                                value={courseEdit?.score}
                                onClick={(e) => setIsFocusName(false)}
                                onChange={(e) => setCourseEdit({...courseEdit , score : parseInt(e.target.value) || 0})}
                            />
                        ):
                        props.getValue()

                },
            }),
            columnHelper.accessor(() => null,{
                id : "Edit",
                header :"Editar Nota",
                enableColumnFilter : false,
                enableGlobalFilter : false,
                cell(props) {
                    return isAuthoriedForUpdateRegister &&
                    <>
                    {courseEdit && courseEdit?.subRoomId == props.row.original.subRoomId ? (
                        <Stack direction="row">
                            <IconButton onClick={()=> handleSubmit()}>
                                {
                                    isSubmitting ?(
                                        <CircularProgress size={20} />
                                    ) : (
                                        <Check/>
                                    )

                                }
                            </IconButton>
                            <IconButton onClick={()=> setCourseEdit(null)}>
                                <Close/>
                            </IconButton>
                        </Stack>
                    ):
                    (
                        <IconButton
                            size="small"
                            color={subRoomId == props.row.original.subRoomId ? "success" : "default"}
                            onClick={()=> {
                            setCourseEdit(props.row.original)
                        }}>
                            <Edit fontSize="small"/>
                        </IconButton>
                    )}
                    </>
                },
            }),
            columnHelper.accessor(() => null,{
                id : "actions",
                header :"Acciones",
                enableColumnFilter : false,
                enableGlobalFilter : false,
                cell(props) {
                    return (
                        <>
                        {
                            isAuthoriedForReadAssistance &&
                            <Tooltip
                                title="Asistencias"
                                placement="top"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 400 }}
                                arrow
                            >

                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={()=> {
                                        router.push(`/app/admin/register/${register?.id}/attendance/${props.row.original.subRoomId}`)
                                    }}>
                                    <FormatListNumbered fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        }
                        {
                            isAuthoriedForCreateRequest &&
                            <Tooltip
                                title="Solicitud de nota"
                                placement="top"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 400 }}
                                arrow
                            >
                                <IconButton
                                    onClick={()=> {
                                        setSubRoomId(props.row.original.subRoomId)
                                        setIsOpenDialogCreate(true)
                                    }}>
                                    <NoteAlt fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        }

                        </>
                    )
                },
            }),

        ],
        [courseEdit , isSubmitting,isAuthoriedForReadAssistance ,isAuthoriedForCreateRequest , isAuthoriedForUpdateRegister]
    )

    return (

    <>
        <DialogCreateRequest userId={data?.user?.id || 0} />
        <DataTable
            //@ts-ignore
            columns={columns}
            data={register?.subRooms || []}
            />
    </>
    )
}
