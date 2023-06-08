import { CircularProgress, Divider, Stack , Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from '@tanstack/react-query';
import API from "@api";
import { useRouter } from "next/router";
import {  DtoResRegisterWithSubRooms } from "resources/types";
import OneRegisterSuper from "resources/components/register/one.register.super";
export default function RegisterById() {

    const router = useRouter()
    const id = parseInt(router.query.id as string) || 0
    const { data: register, isLoading } = useQuery<DtoResRegisterWithSubRooms>(
        ["api/register/byid", id],
        async () => API.getRegisterById(id),
        {
            enabled: id > 0,
        }
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
        <Box
            paddingY={2}
            paddingX={1}
        >
            <Stack
                display={"flex"}
                justifyContent={"space-between"}
            >
                <Typography variant="h4" fontWeight={"bold"} >
                    Registro
                </Typography>
                <Divider />
            </Stack>
            <Stack spacing={1} marginY={2}>
                <Typography variant="h5">
                   Nombres y apellidos : {register?.fullName}
                </Typography>

                <Typography variant="h5" >
                    Fecha de admisión : {register?.dateAdmision}
                </Typography>

                <Typography variant="h5">
                    Turno: {register?.scheduleAdmision}
                </Typography>

                <OneRegisterSuper register={register} />
            </Stack>
        </Box>
    )
}
