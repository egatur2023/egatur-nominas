import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import DataTable from "../data.table";
import { Role, User } from "@prisma/client";
import { useMemo } from "react";
import API from "@api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ResultGetUsers } from "resources/types";
import { Chip, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useStoreUser } from "resources/local/store.user";

export function UserList(){

    const { setIsOpenEdit , setUserToEdit } = useStoreUser()
    const { data : users } = useQuery<ResultGetUsers>(
        {
            queryKey : ["api/users"],
            queryFn : async () => await API.fetchUsers(),
            initialData : [],
        }
    )

    const handleEdit = (user : (User & { role : Role})) => {
        setUserToEdit(user)
        setIsOpenEdit(true)
    }
    const columnHelper = createColumnHelper<(User & { role : Role})>()
    const columns : ColumnDef<(User & { role : Role})>[] = useMemo<ColumnDef<(User & { role : Role}),any>[]>(()=> [
        columnHelper.accessor((_,index)=> ++index,{
            id : "Index",
            header : "N°"
        }),
        columnHelper.accessor("username",{
            header : "Usuario"
        }),
        columnHelper.accessor("email",{
            header : "Córreo"
        }),

        columnHelper.accessor(() => null,{
            header : "Rol",
            id : "RoleName",
            cell(props) {
                return (<Chip label={props.row.original.role.name}/>)
            },
        }),
        columnHelper.accessor(() => null,{
            header : "Rol",
            cell(props) {
                return (<>
                    <IconButton size="small" color="primary" onClick={() => handleEdit(props.row.original)}>
                        <Edit fontSize="small"/>
                    </IconButton>
                </>)
            },
        }),


    ],[])

    return (
        <>
            <DataTable data={users} columns={columns}/>
        </>
    )
}
