import API from "@api";
import { ContentPasteGo, FactCheck } from "@mui/icons-material";
import { Chip, IconButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useMemo } from "react";
import DataTable from "resources/components/data.table";
import DialogEditRequestAdmin from "resources/components/request/dialog.edit.admin";
import { useStoreRequest } from "resources/local/store.request";
import { DtoResRequestsForAdmin } from "resources/types";

export default function RequestIndex(){

    const router = useRouter()
    const { data : requests ,isFetching } = useQuery<DtoResRequestsForAdmin[]>(
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
            columnHelper.accessor("stateRequest",{
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
                            <IconButton onClick={ () => {
                                setRequestToEdit(props.row.original)
                                setIsOpenDialogEdit(true)
                            } }>
                                <FactCheck fontSize="small"/>
                            </IconButton>
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
                        </>
                    )
                },
            }),

        ],
        []
    )

    if(isFetching){
        return <>Cargando...</>
    }

    return (
        <>
            <DialogEditRequestAdmin/>
            <DataTable
                //@ts-ignore
                columns={columns}
                data={requests}
            />
        </>
    )
}
