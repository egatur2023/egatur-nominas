import API from "@api"
import { Add, Edit } from "@mui/icons-material"
import { Box, Button, Card, CardContent, CircularProgress, Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useState } from "react"
import { useQuery } from '@tanstack/react-query'
import DialogBasic from "resources/components/dialog.basic"
import CreateRoom from "resources/components/room/create"
import EditRoom from "resources/components/room/edit"
import { DtoEditRoom, RoomsByCourseId1 } from "resources/types"
import { DateTime } from "luxon"
import { hasPermission } from "resources/functions/helpers.frontend"
import { useSession } from "next-auth/react"

export default function RoomsByCourseId(){

    const router = useRouter()
    const {data} = useSession()
    const byCourseId : number = parseInt(router.query?.byCourseId as string,10)
    const [isOpenCreateRoom , setIsOpenCreateRoom] = useState<boolean>(false)
    const { data : rooms , isLoading } = useQuery<RoomsByCourseId1>(["api/rooms/bycourseid" , byCourseId] , async () => await API.getRoomsByCourseId(byCourseId), { enabled : byCourseId ? true : false , initialData : []})
    const [ isOpenEditRoom , setIsOpenEditRoom] = useState<boolean>(false)
    const [ roomToEdit , setRoomToEdit ] = useState<any>(null)
    const handleClickEdit = (room : any) => {
        setRoomToEdit(room)
        setIsOpenEditRoom(true)
    }

    const isAuthorizedToCreateAulas = hasPermission(data?.user.role.permissions||[],'Aulas.create')
    const isAuthorizedToUpdateAulas = hasPermission(data?.user.role.permissions||[],'Aulas.update')

    if(isLoading){
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
        <Stack spacing={2} marginTop={3}>

            <DialogBasic isOpen={isOpenCreateRoom} handleOpenDialog={setIsOpenCreateRoom}>
                <CreateRoom fnOnCreate={setIsOpenCreateRoom} courseId={byCourseId}/>
            </DialogBasic>
            <DialogBasic isOpen={isOpenEditRoom} handleOpenDialog={setIsOpenEditRoom}>
                <EditRoom fnOnEdit={setIsOpenEditRoom} roomToEdit={roomToEdit}/>
            </DialogBasic>

            <Box display="flex" justifyContent="flex-end">
                {   isAuthorizedToCreateAulas &&
                    <Button variant="contained" onClick={() => setIsOpenCreateRoom(true) }> <Add/> Nuevo Aula</Button>
                }
            </Box>

            <Card variant="outlined">
                <CardContent>
                        <Toolbar>
                            <Typography>
                                {
                                    `${String(router.query?.careerName).toUpperCase()} /
                                    ${String(router.query?.moduleName).toUpperCase()} /
                                    ${String(router.query?.courseName).toLocaleUpperCase()}`
                                }
                            </Typography>
                        </Toolbar>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Aula</TableCell>
                                    <TableCell>Docente</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Hora</TableCell>
                                    <TableCell>Frecuencia</TableCell>
                                    { isAuthorizedToUpdateAulas && <TableCell></TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    rooms && rooms.map((room ,index) => {
                                        return <TableRow key={`TRR${room.id}${index}`}>
                                            <TableCell>{++index}</TableCell>
                                            <TableCell>{room.name}</TableCell>
                                            <TableCell>{room.teacher?.fullName}</TableCell>
                                            <TableCell>{DateTime.fromISO(String(room.dateStart)).toUTC().toLocaleString(DateTime.DATE_SHORT)} - {DateTime.fromISO(String(room.dateEnd)).toUTC().toLocaleString(DateTime.DATE_SHORT)}</TableCell>
                                            <TableCell>{room.hourStart} - {room.hourEnd}</TableCell>
                                            <TableCell>{room.frecuency || "No existe"}</TableCell>
                                            <TableCell>
                                                {
                                                    isAuthorizedToUpdateAulas &&
                                                        <IconButton size="medium" onClick={() => handleClickEdit(room)}>
                                                        <Edit fontSize="small"/>
                                                    </IconButton>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table>

                </CardContent>
            </Card>
        </Stack>
    )
}
