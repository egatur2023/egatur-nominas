import { Autocomplete, Button, Card, CardContent, Checkbox, CircularProgress, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, InputAdornment, InputBase, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "@api";
import { Box } from "@mui/system";
import { DtoCreateRoom, ScheduleType } from "./../../types.d";
import { Add } from "@mui/icons-material";
import { DateTime } from "luxon";
import { Career, CurricularStructure, Teacher } from "@prisma/client";
import { useFormik } from "formik";
import { schemaCreateRoom } from "resources/validation/schema.create.room";
import { useRouter } from "next/router";
import { WEEKDAYS } from "resources/constants";
import { composeNameRoom } from "resources/utils/ui.functions";

type PropsCreateRoom = {
    fnOnCreate: (isOpen: boolean) => void,
    courseId: number
}

export default function CreateRoom({ fnOnCreate, courseId }: PropsCreateRoom) {
    const queryClient = useQueryClient()
    const { data: teachers, isLoading: isLoadingTeachers } = useQuery<Teacher[]>(["teachers"], async () => API.getTeachers())
    const schedules: ScheduleType[] = ["MAÑANA", "TARDE", "NOCHE"]

    const [frecuency, setFrecuency] = useState<any>({})
    const router = useRouter()
    const careerName = useMemo(() => String(router.query.careerName), [])
    const { values: room, handleChange, handleSubmit, errors, setFieldValue, touched, isSubmitting, setSubmitting } = useFormik<DtoCreateRoom>({
        validationSchema: schemaCreateRoom,
        initialValues: {
            courseId: courseId,
            teacherId: 0,
            name: "",
            dateStart: DateTime.now().toUTC().toISODate(),
            dateEnd: DateTime.now().toUTC().toISODate(),
            hourStart: "00:00",
            hourEnd: "00:00",
            schedule: "MAÑANA",
            frecuency: "",
            section: "A"
        },
        onSubmit(validatedRoom) {
            let frecuencyString = Object.keys(frecuency)
                .filter(key => Boolean(frecuency[key]))
                .map(fi => WEEKDAYS[Number(fi)].abbrevation)
                .join("-")

            const newRoom = { ...validatedRoom, frecuency: frecuencyString }
            mutation.mutate(newRoom)//enviar post y actualizar automaticamente la lista
        },
        enableReinitialize: true
    })

    const mutation = useMutation(API.postRoom, {
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["api/rooms/bycourseid"])
            fnOnCreate(false)//cerrar modal
        },
        onError(error, variables, context) {

        },
    })

    const handleChangeFrecuency = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFrecuency({ ...frecuency, [String(e.target.name)]: e.target.checked })
    }


    if (isLoadingTeachers) {
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
            <DialogTitle>
                <Typography variant="h5">Nuevo salón</Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
                <Stack spacing={2} sx={{ mt: 1, p: 2 }}>
                    <TextField
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true
                        }}
                        label="Nombre"
                        size="small"
                        value={room.name}
                        onChange={(e) => setFieldValue("name", e.target.value)}
                    />
                    <Autocomplete
                        size="small"
                        options={teachers || []}
                        getOptionLabel={teacher => (teacher.fullName)}
                        onChange={(e, teacher) => setFieldValue("teacherId", Number(teacher?.id))}
                        renderInput={
                            (params) => <TextField {...params} label="Docente" />
                        }
                    />


                    <Autocomplete
                        size="small"
                        options={schedules}
                        value={room.schedule}
                        onChange={(e, schedule) => {
                            setFieldValue("schedule", schedule)
                            setFieldValue("name", composeNameRoom({ careerName, dateStart: room.dateStart, schedule: schedule || "", section: room.section }))
                        }}
                        getOptionLabel={option => (option as string)}
                        renderInput={(params) =>
                            <TextField name="schedule"
                                {...params}
                                label="Turno"
                            />
                        }
                    />

                    <TextField
                        variant="outlined"
                        label="Seccion"
                        type="text"
                        name="section"
                        size="small"
                        onChange={e => {
                            handleChange(e)
                            setFieldValue("name", composeNameRoom({ careerName, dateStart: room.dateStart, schedule: room.schedule, section: e.target.value }))
                        }}
                        value={room.section}
                    />

                    <TextField
                        variant="outlined"
                        label="Fecha Inicio"
                        type="date"
                        name="dateStart"
                        size="small"
                        onChange={e => {
                            handleChange(e)
                            setFieldValue("name",composeNameRoom({ careerName, dateStart: e.target.value, schedule: room.schedule, section: room.section }))
                        }}
                        value={room.dateStart}
                    />
                    <TextField
                        variant="outlined"
                        label="Fecha Fin"
                        name="dateEnd"
                        type="date"
                        size="small"
                        onChange={handleChange} value={room.dateEnd}
                    />
                    <TextField
                        variant="outlined"
                        label="Hora"
                        type="time"
                        name="hourStart"
                        size="small"
                        onChange={handleChange} value={room.hourStart}
                    />
                    <TextField
                        variant="outlined"
                        label="Hora"
                        type="time"
                        name="hourEnd"
                        size="small"
                        onChange={handleChange} value={room.hourEnd}
                    />

                    <FormControl>
                        <FormLabel>Frecuencia</FormLabel>
                        <FormGroup row>
                            <FormControlLabel control={<Checkbox name="0" onChange={handleChangeFrecuency} />} label="Lunes" />
                            <FormControlLabel control={<Checkbox name="1" onChange={handleChangeFrecuency} />} label="Martes" />
                            <FormControlLabel control={<Checkbox name="2" onChange={handleChangeFrecuency} />} label="Miercoles" />
                            <FormControlLabel control={<Checkbox name="3" onChange={handleChangeFrecuency} />} label="Jueves" />
                            <FormControlLabel control={<Checkbox name="4" onChange={handleChangeFrecuency} />} label="Viernes" />
                            <FormControlLabel control={<Checkbox name="5" onChange={handleChangeFrecuency} />} label="Sábado" />
                            <FormControlLabel control={<Checkbox name="6" onChange={handleChangeFrecuency} />} label="Domingo" />
                        </FormGroup>
                    </FormControl>
                </Stack>

            </DialogContent>
            <DialogActions sx={{ display: "flex", width: "100%" }}>
                <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" onClick={() => { handleSubmit() }}>Crear Salón</Button>
                </Box>
            </DialogActions>
        </>

    )
}
