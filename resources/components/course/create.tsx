import { Alert, Autocomplete, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from "@api";
import { Box } from "@mui/system";
import { CourseType, DtoCreateCourse, DtoEditCourse, ScheduleType } from "./../../types.d";
import { DateTime } from "luxon";
import { useFormik } from "formik";
import { schemaCourse } from "resources/validation/schema.create.course";
import { useStoreCurricular } from "resources/local/store.curricular";


type PropsCreateCourse = {
    fnOnCreate: (isOpen: boolean) => void
}
export default function CreateCourse({ fnOnCreate }: PropsCreateCourse) {

    const { selectedModule, selectedCurricular, selectedCareer } = useStoreCurricular()
    const [message, setMessage] = useState<string>("")
    const { values: course,
        touched,
        errors,
        setSubmitting,
        isSubmitting,
        handleSubmit,
        handleChange } = useFormik<DtoCreateCourse>({

            validationSchema: schemaCourse,
            initialValues: {
                name: "",
                moduleId: selectedModule?.id || 0,
                type: "" || "TEORICO",
                sessions: 0,
            },
            onSubmit(validatedCourse) {
                mutation.mutate(validatedCourse)
                setSubmitting(true)
            },
        })

    const typeCourse: CourseType[] = ["PRACTICO", "TEORICO" , "TEORICO / PRACTICO" ]

    const queryClient = useQueryClient()
    const mutation = useMutation(API.postCourse, {
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["courses"])
            fnOnCreate(false)
        },
        onError(error : any) {
            setSubmitting(false)
            setMessage(error?.response.data.message as string)
        }
    })

    return (
        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h5">Nuevo Curso</Typography>

                    {
                        mutation.isError &&
                        <Alert severity="error">{message}</Alert>
                    }
                    <TextField
                        id="txfCareer"
                        size="small"
                        label="Carrera"
                        defaultValue={selectedCareer?.name}
                        InputProps={{
                            readOnly: true,
                            disabled: true
                        }}
                    />
                    <TextField
                        id="txfCurricular"
                        size="small"
                        label="Malla Curricular"
                        defaultValue={selectedCurricular?.code}
                        InputProps={{
                            readOnly: true,
                            disabled: true
                        }}
                    />

                    <TextField
                        id="txfModule"
                        size="small"
                        label="Módulo"
                        defaultValue={selectedModule?.name}
                        InputProps={{
                            readOnly: true,
                            disabled: true
                        }}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="name"
                        type="text"
                        label="Nombre"
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        onChange={handleChange}
                    />

                    <TextField
                        id="txfSessions"
                        name="sessions"
                        size="small"
                        type="number"
                        label="Cantidad de sesiones"
                        error={touched.sessions && Boolean(errors.sessions)}
                        helperText={touched.sessions && errors.sessions}
                        defaultValue={course.sessions}
                        onChange={handleChange}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="lblIsRegular">Tipo</InputLabel>
                        <Select
                            size="small"
                            labelId="lblIsRegular"
                            name="type"
                            value={course.type}
                            label="Mes"
                            error={touched.type && Boolean(errors.type)}
                            onChange={handleChange}
                        >
                            {
                                typeCourse.map((course, index) =>
                                    <MenuItem key={index} value={course}> {course} </MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>

                    <Box display="flex" justifyContent="flex-end">
                        <Button
                        variant="contained"
                        disabled={isSubmitting}
                        onClick={e => {
                            //@ts-ignore
                            handleSubmit(e)
                        }}

                        > Crear</Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}
