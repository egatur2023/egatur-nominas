import API from "@api";
import { ContentPasteGo, Edit, FactCheck } from "@mui/icons-material";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import DataTable from "resources/components/data.table";
import DialogEditRequestAdmin from "resources/components/request/dialog.edit.admin";
import DialogEditRequestSuper from "resources/components/request/dialog.edit.super";
import { hasPermission } from "resources/functions/helpers.frontend";
import { useStoreRequest } from "resources/local/store.request";
import { DtoResRequestsForAdmin } from "resources/types";

export default function RequestIndex(){

    const router = useRouter()
    const { data } = useSession()
    const { setIsOpenDialogEditForSuper , setRequestToEditForSuper } = useStoreRequest()
    const { data : requests } = useQuery<DtoResRequestsForAdmin[]>(
        ["api/request/admin"],
        async () => await API.getRequestForAdmin(),{
            initialData : []
        }
    )


    const { setIsOpenDialogEdit , setRequestToEdit } = useStoreRequest()
    const colorChip : any  = useMemo(() =>(
        {
            PENDIENTE : "default",
            OBSERVADO : "secondary",
            ACEPTADO : "success",
            RECHAZADO : "error",
        }
    ),[])

    const isAuthorzedForCreateRequest = hasPermission(data?.user?.role.permissions ||[],'Solicitudes.create')
    const isAuthorzedForUpdateRequest = hasPermission(data?.user?.role.permissions ||[],'Solicitudes.update')
    const columnHelper = createColumnHelper<DtoResRequestsForAdmin>()
    const columns : ColumnDef<DtoResRequestsForAdmin,any>[] = useMemo(()=>
        [
            columnHelper.accessor((_,index) => ++index,{
                header :"N°",
            }),
            columnHelper.accessor("dateRequest",{
                header :"Fecha",
            }),
            columnHelper.accessor("curricularName",{
                header :"Malla",
            }),
            columnHelper.accessor("courseName",{
                header :"Curso",
            }),
            columnHelper.accessor("student",{
                header :"Alumno",
            }),
            // columnHelper.accessor("reason",{
            //     header :"Motivo",
            // }),
            columnHelper.accessor("userName",{
                header :"Usuario",
            }),
            columnHelper.accessor("stateUpdate",{
                header :"Estado",
                cell(props) {
                    return <Chip label={props.getValue()} color={colorChip[props.getValue()]} />
                },
            }),
            columnHelper.accessor("score",{
                header :"Nota",
            }),
            columnHelper.accessor(() => 0,{
                header :"Acciones",
                cell(props) {
                    return (
                        <>
                           {
                            isAuthorzedForUpdateRequest &&
                            <Tooltip title="Responder" arrow placement="top">
                                <IconButton onClick={ () => {
                                    setRequestToEdit(props.row.original)
                                    setIsOpenDialogEdit(true)
                                } }>
                                    <FactCheck fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                            }
                            {
                                isAuthorzedForCreateRequest &&
                                <Tooltip title="Editar" arrow placement="top">
                                    <IconButton onClick={ () => {
                                        setRequestToEditForSuper(props.row.original)
                                        setIsOpenDialogEditForSuper(true)
                                    } }>
                                        <Edit fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                            }
                            <Tooltip title="Ir a la nota" arrow placement="top">
                                <IconButton onClick={ () => {
                                    router.push({
                                        pathname : `/app/admin/register/${props.row.original.registerId}`,
                                        query : {
                                            subroomid : props.row.original.subRoomId
                                        }
                                    })
                                } }>
                                    <ContentPasteGo fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        </>
                    )
                },
            }),

        ],
        [isAuthorzedForUpdateRequest]
    )


    return (
        <>
            <DialogEditRequestAdmin/>
            <DialogEditRequestSuper/>
            <DataTable
                //@ts-ignore
                columns={columns}
                data={requests}
            />
        </>
    )
}
