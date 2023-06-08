import { Alert, Button, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from "@api";
import { DtoCreateStudent } from "resources/types";
import { DateTime } from "luxon";
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import DialogFullScreen from "../dialog.fullscreen";
import { useFormik } from "formik";
import { schemaCreateStudent } from "resources/validation/schema.create.student";
import { useStoreRegister } from "resources/local/store.register";

export default function DialogCreateStudent(){
    const [messageError , setMessageError] = useState<string>("")
    const queryClient = useQueryClient()
    const { isOpenDialogStudent , setOpenDialogRegister, setOpenDialogStudent } = useStoreRegister()
    const { values : student ,setSubmitting,isSubmitting,setFieldValue , handleChange , handleSubmit , touched , errors } = useFormik<DtoCreateStudent>({
        initialValues : {
            code : "",
            fullName : "",
            dni : "",
            telephone : "",
            dateStart : DateTime.now().toUTC().toISODate(),
            admision : ""
        },
        validationSchema : schemaCreateStudent,
        onSubmit(validatedStudent) {
            mutation.mutate(validatedStudent)//enviar post y actualizar automaticamente la lista
            setSubmitting(true)
        },
    })


    const mutation = useMutation(API.postStudent,{
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["students"])
            setOpenDialogStudent(false)//cerrar modal
            setOpenDialogRegister(true)
            setSubmitting(false)
        },
        onError(error : any){
            console.log("ERROR",error)
            setMessageError(error?.response?.data?.message as string)
            setSubmitting(false)
        }
    })


    return (
            <DialogFullScreen
                title="Nuevo estudiante"
                isOpen={isOpenDialogStudent}
                renderButton={
                    <Button
                        variant="outlined"
                        disabled={isSubmitting}
                        type="submit"
                        onClick={e => {
                            //@ts-ignore
                            handleSubmit(e)
                        }}>CREAR</Button>
                }
                handleClose={
                    () => {
                        setOpenDialogStudent(false)
                        setOpenDialogRegister(true)
                    }
                }
            >
                <Stack spacing={2} p={4}>
                    {
                        mutation.isError &&
                        <Alert  severity="error">{messageError}</Alert>
                    }
                    <TextField
                        size="small"
                        fullWidth type="text"
                        label="Código"
                        name="code"
                        error={touched.code && Boolean(errors.code)}
                        helperText={touched.code && errors.code}
                        onChange={handleChange}
                    />
                    <TextField
                        size="small"
                        fullWidth type="text"
                        label="Nombre"
                        name="fullName"
                        error={touched.fullName && Boolean(errors.fullName)}
                        helperText={touched.fullName && errors.fullName}
                        onChange={handleChange}
                    />
                    <TextField
                        size="small"
                        fullWidth type="text"
                        label="DNI"
                        name="dni"
                        error={touched.dni && Boolean(errors.dni)}
                        helperText={touched.dni && errors.dni}
                        onChange={handleChange}
                    />
                    <TextField
                        size="small"
                        fullWidth type="text"
                        label="Teléfono"
                        name="telephone"
                        error={touched.telephone && Boolean(errors.telephone)}
                        helperText={touched.telephone && errors.telephone}
                        onChange={handleChange}
                    />
                    <TextField
                        size="small"
                        fullWidth type="text"
                        label="Admisión"
                        name="admision"
                        error={touched.admision && Boolean(errors.admision)}
                        helperText={touched.admision && errors.admision}
                        onChange={handleChange}
                    />
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <MobileDatePicker
                            label="Fecha Inicio"
                            value={student.dateStart}
                            inputFormat="dd/MM/yyyy"
                            renderInput={(params) => <TextField size="small" {...params} name="dateStart" onChange={handleChange} />}
                            onChange={ (value : Date|null) => setFieldValue("dateStart",value,true)}
                        />

                    </LocalizationProvider>
                </Stack>
            </DialogFullScreen>
    )
}
