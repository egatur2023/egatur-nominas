import { Button, CircularProgress, Divider,  Stack,  Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from '@tanstack/react-query';
import API from "@api";
import { useRouter } from "next/router";
import { Course, Register, Room } from "@prisma/client";
import { useState } from "react";
import DialogBasic from "resources/components/dialog.basic";
import ListRoomsByCourse from "resources/components/room/list.bycourse";
import { Add } from "@mui/icons-material";

import CreateSubRoom from "resources/components/subroom/create";
import DialogCreateSubRoom from "resources/components/subroom/create";
import DataTable from "resources/components/data.table";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { DtoResRegisterRowCourse } from "resources/types";
import { useStoreRegister } from "resources/local/store.register";
import { useStoreEnrollment } from "resources/local/store.enrollment";

export default function Detail() {

    const router = useRouter()
    const { clearEnrollRooms } = useStoreEnrollment()
    const byRegisterId = parseInt(router.query.byRegisterId as string) || 0
    const [rooms , setRooms] = useState<Room[]>([])
    const [subRoomId , setSubRoomId] = useState<number>(0)
    const [isOpenRooms , setIsOpenRooms] = useState<boolean>(false)
    const [isOpenCreateRoom , setIsOpenCreateRoom] = useState<boolean>(false)
    const [ courses , setCourses ] = useState<Course[]>([])

    const { data: register , isLoading } = useQuery<any>(
        ["api/register/enrollment/byid",byRegisterId]
        , async () => API.getRegisterByIdToEnrollment(byRegisterId) ,
        {
            enabled : byRegisterId > 0,
            onSuccess(register : any) {
              setCourses(register.courses as Course[])
            },
        }
    )

    const handleOpenRooms = (course : DtoResRegisterRowCourse) => {
        setRooms(course.rooms)
        setSubRoomId(course.subscriptionCourseId)
        setIsOpenRooms(true)
    }

    const columnHelper = createColumnHelper<DtoResRegisterRowCourse>()
    const columns : ColumnDef<DtoResRegisterRowCourse,any>[] = useMemo(() => [
        columnHelper.accessor((_,index)=> ++index,{
            id : "index",
            header : "N°"
        }),
        columnHelper.accessor("courseName",{
            header : "Curso"
        }),
        columnHelper.accessor("typeCourse",{
            header : "Tipo"
        }),
        columnHelper.accessor("moduleName",{
            header : "Modulo"
        }),
        columnHelper.accessor("roomName",{
            header : "Aula"
        }),
        columnHelper.accessor(() => 0,{
            header : "Editar",
            cell(props) {
                return (
                    <Button variant="outlined" onClick={ () => handleOpenRooms(props.row.original) }>
                        Reasignar
                    </Button>
                )
            },
        }),
    ],[])


    const handleCreateSubRoom = (curricularId : number) =>{
        setIsOpenCreateRoom(true)
    }

    const handleCloseCreateSubRoom = () => {
        setIsOpenCreateRoom(false)
        clearEnrollRooms()
    }



    if(!byRegisterId) return <>404</>;

    if (isLoading) {
        return <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"100vh"}
        >
            <CircularProgress/>
        </Box>
    }

    return (
        <Stack
            marginTop={2}
            marginBottom={6}
            marginX={2}
            spacing={2}
        >
            <DialogBasic handleOpenDialog={setIsOpenRooms} isOpen={isOpenRooms}>
                <ListRoomsByCourse
                    subRoomId={subRoomId}
                    rooms={rooms}
                    handleClose={()=> setIsOpenRooms(false)}/>
            </DialogBasic>
            <DialogCreateSubRoom
                isOpen={isOpenCreateRoom}
                enrolledSubRooms={courses}
                handleClose={handleCloseCreateSubRoom}
                curricular={ { id : register?.curricularId || 0 , code : register?.curricularName || "" , registerId : byRegisterId } }
            />

            <Stack
                display={"flex"}
                justifyContent={"space-between"}
            >
                <Typography variant="h4" >
                    Matricula
                </Typography>
                <Divider/>
            </Stack>
            <Stack spacing={1} marginTop={2}>
                <Typography variant="subtitle1">
                    Nombres y apellidos : {register?.fullName}
                </Typography>

                <Typography variant="subtitle1" >
                    Fecha de admisión : { register?.dateAdmision }
                </Typography>

                <Typography variant="subtitle1">
                    Turno: {register?.scheduleAdmision}
                </Typography>
            </Stack>

            <Box display="flex" justifyContent="flex-end">
                <Button
                    variant="outlined"
                    onClick={()=> handleCreateSubRoom(register?.curricularId)}
                >
                    <Add fontSize="small" sx={{mr : 1}}/> Nuevo curso
                </Button>
            </Box>
            <DataTable
                data={courses}
                //@ts-ignore
                columns={columns}
            />

        </Stack>
    )
}
