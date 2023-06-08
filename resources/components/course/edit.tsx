import API from "@api";
import { Autocomplete, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CourseType, DtoEditCareer, DtoEditCourse } from "resources/types";


type PropsEditCourse = {
    fnOnEdit: (isOpen: boolean) => void
    courseToEdit: DtoEditCourse
}

export default function EditCourse({ fnOnEdit, courseToEdit }: PropsEditCourse) {
    const queryClient = useQueryClient()
    const [course, setCourse] = useState<DtoEditCourse>(courseToEdit)
    const typeCourse: CourseType[] = ["PRACTICO", "TEORICO" , "TEORICO / PRACTICO"]

    const mutation = useMutation(API.putCourse, {
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["courses"])
        },
    })

    const handleChangeCourse = (property: string, value: any) => {
        setCourse({ ...course, [property]: value })
    }

    const handleSubmit = async () => {
        try {
            mutation.mutate(course)//enviar post y actualizar automaticamente la lista
            fnOnEdit(false)//cerrar modal
        } catch (error) {
            console.error(error)
        }
    }

    return (

        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2}>

                    <TextField
                        disabled
                        id="txfCareer"
                        size="small"
                        label="Carrera"
                        defaultValue={courseToEdit.careerName}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        disabled
                        id="txfCurricular"
                        size="small"
                        label="Malla Curricular"
                        defaultValue={courseToEdit.curricularCode}
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <TextField
                        disabled
                        id="txfModule"
                        size="small"
                        label="Módulo"
                        defaultValue={courseToEdit.moduleName}
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <TextField
                        size="small"
                        fullWidth
                        type="text"
                        label="Nombre"
                        onChange={e => handleChangeCourse("name", e.target.value)}
                        defaultValue={courseToEdit.name}
                    />

                    <TextField
                        id="txfSessions"
                        size="small"
                        label="Cantidad de sesiones"
                        defaultValue={course.sessions}
                        onChange={(e) => handleChangeCourse("sessions", e.target.value)}
                    />

                    <Autocomplete
                        size="small"
                        options={typeCourse}
                        value={courseToEdit.type}
                        onChange={(e, type) => handleChangeCourse("type", type)}
                        getOptionLabel={option => (option as string)}
                        renderInput={(params) => <TextField {...params} label="Tipo" />}
                    />

                    <Box display="flex" justifyContent="flex-end">
                        <Button variant="contained" onClick={() => handleSubmit()}>Editar</Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}
