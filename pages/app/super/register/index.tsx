import {  useQuery } from '@tanstack/react-query';
import { DtoResRegister } from "resources/types";
import { Box, CircularProgress } from "@mui/material";
import { Visibility } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import API from "@api";
import DataTable from 'resources/components/data.table';
import { useRouter } from 'next/router';

export default function IndexRegister(){

    const router = useRouter()
    const { data: registers, isLoading } = useQuery<DtoResRegister[]>(["registers"], async () => API.getRegisters(),{
        initialData : []
    })

    const handleGotToRegisterById = (registerId : number) => {
        router.push(`/app/super/register/${registerId}`)
    }
    const columnHelper = createColumnHelper<DtoResRegister>()
    //@ts-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns : ColumnDef<DtoResRegisterSubRoom,any>[] = useMemo(()=>
        [
            columnHelper.accessor((_ ,index : number) => ++index,{
                header :"N°",
                enableGlobalFilter : false,
            }),
            columnHelper.accessor("fullName",{
                id : "courseName",
                header :"Alumno",
                enableGlobalFilter : true,
            }),
            columnHelper.accessor("dateAdmision",{
                header :"Admisión",
                enableGlobalFilter : true,
            }),
            columnHelper.accessor("scheduleAdmision",{
                header :"Turno",
                enableGlobalFilter : true,
                // sortingFn : fuzzySort,
            }),
            columnHelper.accessor("curricularName",{
                header :"Curricula",
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
            columnHelper.accessor(() => null,{
                id : "Edit",
                header :"Acciones",
                enableColumnFilter : false,
                enableGlobalFilter : false,
                cell : (props) => (
                    <IconButton size="small" onClick={() => handleGotToRegisterById(props.row.original.id)}>
                        <Visibility fontSize="small"/>
                    </IconButton>
                ),
            })
        ],
        []
    )

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
            <DataTable
                data={registers}
                //@ts-ignore
                columns={columns}
            />
        </>
    )

}
