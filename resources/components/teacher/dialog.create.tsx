import API from "@api"
import { MoreVert } from "@mui/icons-material"
import { Alert, Box, Button, Card, CardContent, CircularProgress, IconButton, Stack, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { Teacher } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import { useState } from "react"
import { useStoreTeacher } from "resources/local/store.teacher"
import { DtoCreateTeacher } from "resources/types"
import { schemaTeacher } from "resources/validation/schema.create.teacher"
import DialogBasic from "../dialog.basic"

export default function DialogCreateTeacher() {

    const { isOpenDialogCreate , setIsOpenDialogCreate } = useStoreTeacher()
    const [message, setMessage] = useState<string>("")
    const { values: teacher,
        touched,
        errors,
        setSubmitting,
        isSubmitting,
        handleSubmit,
        handleChange } = useFormik<DtoCreateTeacher>({
            validationSchema: schemaTeacher,
            initialValues: {
                fullName: "",
                dni: "",
                telephone: ""
            },
            onSubmit(validatedCourse) {
                mutation.mutate(validatedCourse)
                setSubmitting(true)
            },
        })
    const queryClient = useQueryClient()

    const mutation = useMutation(API.postTeacher, {
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["teachers"])
            setIsOpenDialogCreate(false)
        },
        onError(error: any) {
            setSubmitting(false)
            setMessage(error?.response.data.message as string)
        }
    })

    return (
        <DialogBasic isOpen={isOpenDialogCreate} handleOpenDialog={setIsOpenDialogCreate}>
            <Card variant="outlined">
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h5">Nuevo Docente</Typography>

                        {
                            mutation.isError &&
                            <Alert severity="error">{message}</Alert>
                        }
                        <TextField
                            fullWidth
                            id="txfDNI"
                            name="dni"
                            size="small"
                            type="text"
                            label="DNI"
                            error={touched.dni && Boolean(errors.dni)}
                            helperText={touched.dni && errors.dni}
                            onChange={handleChange}
                        />

                        <TextField
                            fullWidth
                            id="txfFullName"
                            name="fullName"
                            size="small"
                            type="text"
                            label="Apellidos y Nombres"
                            error={touched.fullName && Boolean(errors.fullName)}
                            helperText={touched.fullName && errors.fullName}
                            defaultValue={teacher.fullName}
                            onChange={handleChange}
                        />

                        <TextField
                            fullWidth
                            id="txfTelephone"
                            name="telephone"
                            size="small"
                            type="text"
                            label="Celular/Telefono"
                            error={touched.telephone && Boolean(errors.telephone)}
                            helperText={touched.telephone && errors.telephone}
                            defaultValue={teacher.telephone}
                            onChange={handleChange}
                        />

                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                disabled={isSubmitting}
                                endIcon={isSubmitting ? <CircularProgress size={10}></CircularProgress> : <></>}
                                onClick={e => {
                                    //@ts-ignore
                                    handleSubmit(e)
                                }}
                            > Crear</Button>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </DialogBasic>
    )
}
