import { Alert, Button,Stack, TextField } from "@mui/material"
import { useState } from "react"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from "@api";
import {  DtoEditRegister } from "../../types";
import { DateTime } from "luxon";
import DialogFullScreen from "../dialog.fullscreen";
import { useFormik } from "formik";
import { schemaEditRegister } from "resources/validation/schema.edit.register";
import { useStoreRegister } from "resources/local/store.register";


export default function DialogEditRegister() {

    const queryClient = useQueryClient()
    const { isOpenDialogEditRegister , registerToEdit , setOpenDialogEditRegister } = useStoreRegister()
    const [message , setMessage] = useState<string>("")
    const {
        values : register,
        touched,
        errors,
        isSubmitting ,
        setSubmitting ,
        handleChange ,
        handleSubmit,
        resetForm
    } = useFormik<DtoEditRegister>({
        validationSchema : schemaEditRegister ,
        initialValues : {
            registerId : 0,
            dateStart : DateTime.now().toUTC().toISODate(),
            dateEnd : registerToEdit?.dateEnd || "",
        },
        onSubmit(validatedRegister){
            let _validated = {...validatedRegister,registerId : registerToEdit?.id || 0}
            mutation.mutate(_validated)//enviar post y actualizar automaticamente la lista
            setSubmitting(true)
        },
    })

    const mutation = useMutation(API.putRegister, {
        onSuccess(response) {
            queryClient.invalidateQueries(["registers"])
            setSubmitting(false)
            resetForm()
            setOpenDialogEditRegister(false)
        },
        onError(error : any){
            resetForm()
            setMessage(error?.response?.data?.message as string)
            setSubmitting(false)
        }
    })

    return (
        <DialogFullScreen
            isOpen={isOpenDialogEditRegister}
            handleClose={()=> setOpenDialogEditRegister(false)}
            renderButton={
                <Button
                    variant="outlined"
                    disabled={isSubmitting}
                    onClick={ e => {
                        //@ts-ignore
                        handleSubmit(e)
                    }}
                >Actualizar</Button>
            }
            title="Editar registro"
        >
                <Stack spacing={2} sx={{ mt : 1 , p : 4 }}>
                    {
                        mutation.isError &&
                        <Alert severity="error">{message}</Alert>
                    }

                    <TextField
                        defaultValue={registerToEdit?.fullName}
                        disabled
                        label="Estudiante"
                    />

                    <TextField
                        defaultValue={registerToEdit?.careerName}
                        disabled
                        label="Carrera"
                    />

                    <TextField
                        label="Malla Curricular"
                        defaultValue={registerToEdit?.curricularName}
                        disabled
                    />

                    <TextField
                        label="Turno"
                        defaultValue={registerToEdit?.scheduleAdmision}
                        disabled
                    />

                    <TextField
                        type="date"
                        name="dateStart"
                        defaultValue={DateTime.fromISO(String(registerToEdit?.dateStart)).toUTC().toISODate()}
                        error={touched.dateStart && Boolean(errors.dateStart)}
                            helperText={touched.dateStart && errors.dateStart}
                        onChange={handleChange}
                        label="Fecha inicio"
                    />
                    <TextField
                        type="date"
                        name="dateEnd"
                        InputLabelProps={{
                            shrink : true
                         }}
                        defaultValue={DateTime.fromISO(String(registerToEdit?.dateEnd)).toUTC().toISODate() || ""}
                        error={touched.dateEnd && Boolean(errors.dateEnd)}
                        helperText={touched.dateEnd && errors.dateEnd}
                        onChange={handleChange}
                        label="Fecha inicio"
                    />

                </Stack>
        </DialogFullScreen>
    )
}
