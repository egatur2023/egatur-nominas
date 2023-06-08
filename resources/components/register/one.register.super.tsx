import { IconButton } from "@mui/material";
import { DtoResRegisterSubRoom, DtoResRegisterWithSubRooms } from "resources/types";
import {  ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Edit, NoteAlt } from "@mui/icons-material";
import DataTable from "../data.table";
import { useStoreRequest } from "resources/local/store.request";
import DialogCreateRequest from "../request/dialog.create";
import { useSession } from "next-auth/react";

export default function OneRegisterSuper({register} : {register : DtoResRegisterWithSubRooms | undefined }) {

    const columnHelper = createColumnHelper<DtoResRegisterSubRoom>()
    const { setIsOpenDialogCreate , setSubRoomId  } = useStoreRequest()

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
            }),
            columnHelper.accessor(() => null,{
                id : "Edit",
                header :"Acciones",
                enableColumnFilter : false,
                enableGlobalFilter : false,
                cell(props) {
                    return (
                        <IconButton
                            onClick={()=> {
                                setSubRoomId(props.row.original.subRoomId)
                                setIsOpenDialogCreate(true)
                        }}>
                            <NoteAlt fontSize="small"/>
                        </IconButton>
                    )
                },
            })
        ],
        []
    )

    const { data } : { data : any  } = useSession()



    return (
        <>
        <DataTable
            //@ts-ignore
            columns={columns}
            data={register?.subRooms || []}
            />
        <DialogCreateRequest userId={data?.user?.id || 0} />
        </>
    )
}
