import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import DataTable from "../data.table";
import { ModuleSystem } from "@prisma/client";
import { useMemo } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Delete, DeleteForever } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import API from "@api";

export default function ModuleSystemList(){


    const { data : modulesSystem} = useQuery<ModuleSystem[]>(
        ["api/ms"],
        async ()=> await API.fetchModulesSystem(),
        {
            initialData : [],
        }
    )
    const columnHelper = createColumnHelper<ModuleSystem>()

    const columns : ColumnDef<ModuleSystem>[] = useMemo<ColumnDef<ModuleSystem,any>[]>(()=> [
        columnHelper.accessor((_,index)=> ++index,{
            header : "N°"
        }),
        columnHelper.accessor("name",{
            header : "Módulo"
        }),
        columnHelper.accessor(()=>null,{
            header : "Acciones",
            cell(props) {
                return (<>
                    <Tooltip title="Eliminar">
                        <IconButton size="small" color="error">
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </>)
            },
        }),
    ],[])
    return (
        <>
            <DataTable columns={columns} data={modulesSystem}/>
        </>
    )
}
