import API from "@api";
import { Edit, FactCheck } from "@mui/icons-material";
import { Chip, IconButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import DataTable from "resources/components/data.table";
import DialogEditRequestSuper from "resources/components/request/dialog.edit.super";
import { useStoreRequest } from "resources/local/store.request";
import { DtoResRequestsForAdmin } from "resources/types";

export default function RequestIndex(){

    const { data : requests ,isFetching } = useQuery<DtoResRequestsForAdmin[]>(
        ["api/request/admin"],
        async () => await API.getRequestForAdmin(),{
            initialData : []
        }
    )


    const { setIsOpenDialogEditForSuper , setRequestToEditForSuper } = useStoreRequest()
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
                            <IconButton onClick={ () => {
                                setRequestToEditForSuper(props.row.original)
                                setIsOpenDialogEditForSuper(true)
                            } }>
                                <Edit fontSize="small"/>
                            </IconButton>
                        </>
                    )
                },
            }),

        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    if(isFetching){
        return <>Cargando...</>
    }

    return (
        <>
            <DialogEditRequestSuper/>
            <DataTable
                //@ts-ignore
                columns={columns}
                data={requests}
            />
        </>
    )
}
