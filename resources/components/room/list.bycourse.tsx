import API from "@api"
import { MeetingRoom, RemoveCircle } from "@mui/icons-material"
import { Button, Card, CardContent, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Radio, RadioGroup, Stack, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { Room } from "@prisma/client"
import { useState } from "react"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DtoEditSubRoom } from "resources/types"
import { useStoreEnrollment } from "resources/local/store.enrollment"

type PropsListRoomsByCourse = {
    rooms: Room[]
    subRoomId: number

    handleClose: () => void
}
export default function ListRoomsByCourse({ rooms, subRoomId, handleClose }: PropsListRoomsByCourse) {

    const queryClient = useQueryClient()
    const {roomId} = useStoreEnrollment()

    const [subRoom, setSubRoom] = useState<DtoEditSubRoom>({
        roomId: roomId,
        subRoomId : subRoomId,
    })
    const mutation = useMutation(API.putSubRoom, {
        onSuccess: () => {
            queryClient.invalidateQueries(["api/register/enrollment/byid"])
        }
    })
    const handleChangeSubscriptionCourse = (property: string, value: any) => {
        setSubRoom({ ...subRoom, [property]: value })
    }

    const handleSubmit = () => {
        mutation.mutate(subRoom)
        handleClose()
    }
    return (
        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2}>
                    <Typography>Salones disponibles</Typography>
                    <List>
                        {
                            rooms && rooms.map(room => {
                                return (
                                    <ListItem
                                        key={`LI${room.courseId}${room.id}`}
                                        disablePadding
                                    >
                                        <ListItemButton
                                            selected={room.id === subRoom.roomId}
                                            onClick={() => handleChangeSubscriptionCourse("roomId", room.id)}
                                        >
                                            <ListItemIcon>
                                                <MeetingRoom fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>{room.name} {room.hourStart}-{room.hourEnd} - {room.schedule}</ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })
                        }
                    </List>

                    <Box display="flex" justifyContent="flex-end">
                        <Button disabled={subRoom.roomId == 0} variant="outlined" onClick={handleSubmit}>Asignar aula</Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}
