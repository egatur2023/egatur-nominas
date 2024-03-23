import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@api";
import { ResultGetRoles } from "resources/types";
import { useMemo, useState } from "react";
import { Box, Button, Card, CardContent, Checkbox, Divider, List, ListItem, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from "@mui/material"
import { ModuleSystem, Permission } from "@prisma/client";
import { useSession } from 'next-auth/react'


type TabPanelPermissionProps = {
    id : number
    selectedId : number
    permissions : ({ module: ModuleSystem } & Permission)[]
    children?: React.ReactNode
}
export default function RoleList(){
    const { data , update } = useSession()

    const qc = useQueryClient()
    const { data : roles } = useQuery<ResultGetRoles>(
        ["api/roles"],
        async() => await API.fetchRoles(),{
        initialData: []
    })

    const [index, setIndex] = useState<number>(0);
    const TabPanelPermission = ({id , selectedId , permissions : initialPermissions ,  children} : TabPanelPermissionProps) => {
        const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
        const mutation = useMutation(
            API.putPermission,
            {
                onSuccess: (data, variables, context) => {
                    qc.invalidateQueries(["api/roles"])
                    qc.invalidateQueries(["roles"])
                    setIsSubmitting(false)
                    update()
                },
                onError: (error) => {
                    setIsSubmitting(false)
                    console.log(error)
                }
            }
        )
        const [permissions , setPermissions] = useState<({ module: ModuleSystem } & Permission)[]>(initialPermissions)
        const handleChangePermission = (permission: Permission,prop : string) => {
            setIsSubmitting(true)
            //@ts-ignore
            permission[prop] = !permission[prop]
            mutation.mutate(permission)
        }
        return (
            <div
            role="tabpanel"
            hidden={selectedId !== id}
            id={`tab-${id}`}
            aria-labelledby={`tab-${id}`}
            >
            {selectedId === id && (
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Modulo</TableCell>
                                <TableCell>Crear</TableCell>
                                <TableCell>Ver</TableCell>
                                <TableCell>Editar</TableCell>
                                {/* <TableCell>Eliminar</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                permissions.map((permission) => (
                                    <TableRow key={permission.id}>
                                        <TableCell>{permission.module.name}</TableCell>
                                        <TableCell>
                                            <Checkbox disabled={isSubmitting} checked={permission.create} onChange={() => handleChangePermission({...permission},"create")}/>
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox disabled={isSubmitting} checked={permission.read} onChange={() => handleChangePermission({...permission},"read")}/>
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox disabled={isSubmitting} checked={permission.update} onChange={() => handleChangePermission({...permission},"update")}/>
                                        </TableCell>
                                        {/* <TableCell>
                                            <Checkbox disabled={isSubmitting} checked={permission.delete} onChange={() => handleChangePermission({...permission},"delete")}/>
                                        </TableCell> */}
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            </div>
        )
    }

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number)=> {
        setIndex(newValue)
    }


    return (
    <Stack alignItems="center" >
        <Box
            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex'}}
        >

            <Tabs value={index} onChange={handleChangeTab} orientation="vertical"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                {
                roles && roles.map((role,i) => (
                    <Tab key={role.name} id={`tab-p-${i}`} label={role.name}/>
                ))
                }
            </Tabs>

            {
                roles && roles.map((role,i) => (
                    <TabPanelPermission key={role.name} permissions={role.permissions} id={i} selectedId={index}/>
                ))
            }
        </Box>

    </Stack>)
}
