
import { Autocomplete, Button, Card, CardContent, Checkbox, CircularProgress, DialogContent, Divider, FormControlLabel, FormGroup, IconButton, InputAdornment, InputBase, InputLabel, Paper, Stack, TextField, Typography } from "@mui/material"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "@api";
import { Box } from "@mui/system";
import { DateTime } from "luxon";
import { Teacher } from "@prisma/client";
import { DtoEditRoom, ScheduleType, WeekDays } from "resources/types";
import { useFormik } from "formik";
import { WEEKDAYS } from "resources/constants";
import { useRouter } from "next/router";
import { schemaEditRoom } from "resources/validation/schema.edit.room";
import { composeNameRoom, getWeekDaysChecked } from "resources/utils/ui.functions";
import { Row } from "jspdf-autotable";

type PropsEditRoom = {
    fnOnEdit: (isOpen: boolean) => void
    roomToEdit: DtoEditRoom | null
}


export default function EditRoom({ fnOnEdit, roomToEdit }: PropsEditRoom) {
    const queryClient = useQueryClient()
    const router = useRouter()
    const careerName = useMemo(() => String(router.query.careerName), [])
    const { data: teachers, isLoading: isLoadingTeachers } = useQuery<Teacher[]>(["teachers"], async () => API.getTeachers())
    const schedules: ScheduleType[] = ["MAÑANA", "TARDE", "NOCHE"]

    const [frecuency, setFrecuency] = useState<any>(getWeekDaysChecked(String(roomToEdit?.frecuency)))

    const { values: room, setFieldValue, errors, isSubmitting, setSubmitting, touched, handleChange, handleSubmit } = useFormik<DtoEditRoom>({
        validationSchema: schemaEditRoom,
        initialValues: {
            id: roomToEdit?.id || 0,
            name: roomToEdit?.name || "",
            dateEnd: roomToEdit?.dateEnd || "",
            dateStart: roomToEdit?.dateStart || "",
            hourStart: roomToEdit?.hourStart || "",
            hourEnd: roomToEdit?.hourEnd || "",
            schedule: roomToEdit?.schedule || "MAÑANA",
            teacherId: roomToEdit?.teacherId || 0,
            frecuency: "",
            section: roomToEdit?.section || "A"
        },
        onSubmit(validatedRoom) {
            const frecuencyString = Object.keys(frecuency)
                .filter(key => Boolean(frecuency[key]))
                .map(fi => WEEKDAYS[Number(fi)].abbrevation)
                .join("-")
            const newRoom = { ...validatedRoom, frecuency: frecuencyString }
            mutation.mutate(newRoom)//enviar post y actualizar automaticamente la lista
            setSubmitting(true)
        },
    })

    const handleChangeFrecuency = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFrecuency({ ...frecuency, [String(e.target.name)]: e.target.checked })
    }

    const mutation = useMutation(API.putRoom, {
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["api/rooms/bycourseid"])
            setSubmitting(false)
            fnOnEdit(false)//cerrar modal
        },
        onError(error, variables, context) {
            setSubmitting(false)
            console.log(error)
        },
    })

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
        <DialogContent>
            <Stack spacing={2} sx={{ mt: 1, p: 2 }} >
                <Typography>Editar salón {room.name}</Typography>
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
                    value={teachers?.find(t => t.id === room.teacherId)}
                    getOptionLabel={teacher => (teacher.fullName || "")}
                    onChange={(e, teacher) => setFieldValue("teacherId", teacher?.id)}
                    renderInput={(params) => <TextField {...params} label="Docente" />}
                />

                <Autocomplete
                    size="small"
                    options={schedules}
                    value={room.schedule}
                    onChange={(e, schedule) => {
                        setFieldValue("schedule", schedule)
                        setFieldValue("name",composeNameRoom({ careerName, dateStart: room.dateStart, schedule: schedule || "", section: room.section }))
                    }}
                    getOptionLabel={option => (option as string)}
                    renderInput={(params) => <TextField {...params} label="Turno" />}
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
                    size="small"
                    name="dateStart"
                    value={DateTime.fromISO(room.dateStart).toUTC().toISODate()}
                    onChange={e => {
                        handleChange(e)
                        setFieldValue("name",composeNameRoom({ careerName, dateStart: e.target.value, schedule: room.schedule, section: room.section }))
                    }}
                />
                <TextField
                    variant="outlined"
                    label="Fecha Fin"
                    type="date"
                    size="small"
                    name="dateEnd"
                    value={DateTime.fromISO(room.dateEnd).toUTC().toISODate()}
                    onChange={handleChange}
                />

                <TextField
                    variant="outlined"
                    label="Hora"
                    type="time"
                    size="small"
                    name="hourStart"
                    onChange={handleChange}
                    value={room.hourStart}
                />
                <TextField
                    variant="outlined"
                    label="Hora"
                    type="time"
                    size="small"
                    name="hourEnd"
                    onChange={handleChange}
                    value={room.hourEnd}
                />

                <FormGroup sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
                    <FormControlLabel control={<Checkbox onChange={handleChangeFrecuency} checked={Boolean(frecuency[0])} name="0" />} label="Lunes" />
                    <FormControlLabel control={<Checkbox onChange={handleChangeFrecuency} checked={Boolean(frecuency[1])} name="1" />} label="Martes" />
                    <FormControlLabel control={<Checkbox onChange={handleChangeFrecuency} checked={Boolean(frecuency[2])} name="2" />} label="Miercoles" />
                    <FormControlLabel control={<Checkbox onChange={handleChangeFrecuency} checked={Boolean(frecuency[3])} name="3" />} label="Jueves" />
                    <FormControlLabel control={<Checkbox onChange={handleChangeFrecuency} checked={Boolean(frecuency[4])} name="4" />} label="Viernes" />
                    <FormControlLabel control={<Checkbox onChange={handleChangeFrecuency} checked={Boolean(frecuency[5])} name="5" />} label="Sábado" />
                    <FormControlLabel control={<Checkbox onChange={handleChangeFrecuency} checked={Boolean(frecuency[6])} name="6" />} label="Domingo" />
                </FormGroup>

                <Box display="flex" justifyContent="flex-end">
                    <Button
                        disabled={isSubmitting}
                        variant="contained"
                        endIcon={isSubmitting ? <CircularProgress size={10}></CircularProgress> : <></>}
                        onClick={() => {
                            handleSubmit()
                        }}>Actualizar Salón</Button>
                </Box>
            </Stack>
        </DialogContent>

    )
}
