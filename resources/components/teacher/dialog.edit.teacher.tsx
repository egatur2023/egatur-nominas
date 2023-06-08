import API from "@api"
import { MoreVert } from "@mui/icons-material"
import { Alert, Box, Button, Card, CardContent, CircularProgress, DialogContent, IconButton, Stack, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { Teacher } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import { useState } from "react"
import { useStoreTeacher } from "resources/local/store.teacher"
import { DtoCreateTeacher, DtoEditTeacher } from "resources/types"
import { schemaTeacher } from "resources/validation/schema.create.teacher"
import DialogBasic from "../dialog.basic"

type PropsEditTeacher = {
    teacherToEdit: Teacher
}

export default function DialogEditTeacher({  teacherToEdit }: PropsEditTeacher) {

    const queryClient = useQueryClient()
    const { isOpenDialogEdit , setIsOpenDialogEdit } = useStoreTeacher()
    const [messageError, setMessageError] = useState<string>("")
    const { values: teacher, isSubmitting, setSubmitting, touched, errors, handleChange, handleSubmit } = useFormik<DtoEditTeacher>({
        initialValues: {
            id: teacherToEdit?.id,
            dni: teacherToEdit?.dni,
            fullName: teacherToEdit?.fullName,
            telephone: teacherToEdit?.telephone
        },
        validationSchema: schemaTeacher,
        onSubmit(validatedTeacher) {
            mutation.mutate(validatedTeacher)//enviar post y actualizar automaticamente la lista
            setSubmitting(true)
        },
        enableReinitialize: true
    })

    const mutation = useMutation(API.putTeacher, {
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["teachers"])
            setSubmitting(false)
            setIsOpenDialogEdit(false)//cerrar modal
        },
        onError: (error: any) => {
            setSubmitting(false)
            setMessageError(error?.response?.data?.message as string)
        }
    })


    return (
        <DialogBasic isOpen={isOpenDialogEdit} handleOpenDialog={setIsOpenDialogEdit}>
            <DialogContent>
                <Stack spacing={2}>
                    <Typography variant="h5">Editar Docente</Typography>
                    {
                        mutation.isError &&
                        <Alert severity="error">{messageError}</Alert>
                    }
                    <TextField
                        fullWidth
                        id="txfDNI"
                        name="dni"
                        size="small"
                        type="text"
                        label="DNI"
                        value={teacher.dni}
                        error={touched.dni && Boolean(errors.dni)}
                        helperText={touched.dni && errors.dni}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        id="txfFullName"
                        size="small"
                        label="Apellidos y Nombres"
                        name="fullName"
                        onChange={handleChange}
                        type="text"
                        value={teacher.fullName}
                        error={touched.fullName && Boolean(errors.fullName)}
                        helperText={touched.fullName && errors.fullName}


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
                        value={teacher.telephone}
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
                        > Actualizar</Button>
                    </Box>
                </Stack>
            </DialogContent>
        </DialogBasic>
    )
}
