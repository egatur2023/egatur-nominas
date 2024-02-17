import { useStoreRegister } from "resources/local/store.register";
import DialogBasic from "../dialog.basic";
import { Box, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@api";
import { useState } from "react";
import { useFormik } from "formik";
import { DtoUpdateRegister } from "resources/types";
import { schemaEditObservationRegister } from "resources/validation/schema.edit.observation.register";
export default function DialogEditObservationRegister(){

    const qc = useQueryClient()
    const { dialogObservationIsOpen , registerEditObservation ,setOpendialogEditObservation , setRegisterToEditObservation} = useStoreRegister()
    const { values ,isSubmitting ,handleSubmit,setSubmitting ,handleChange ,resetForm} = useFormik<DtoUpdateRegister>({
        validationSchema : schemaEditObservationRegister,
        onSubmit(valuesValidated, formikHelpers) {
            console.log({valuesValidated})
            mutation.mutate(valuesValidated)

        },
        initialValues : {
            registerId : registerEditObservation?.id || 0,
            observation : registerEditObservation?.observation || ""
        },
        enableReinitialize : registerEditObservation != null
    })

    const mutation = useMutation(
        API.putObservationRegister,
        {
            onSuccess(data, variables, context) {
                setRegisterToEditObservation(null)
                setOpendialogEditObservation(false)
                setSubmitting(false)
                qc.invalidateQueries(["registers"])
                resetForm()
                console.log({res : data})
            },
            onError(error, variables, context) {
                console.log(error)
                setSubmitting(false)
            }
        }
    )

    const handleOpenDialog = (isOpen : boolean) => {
        setOpendialogEditObservation(isOpen)
        setRegisterToEditObservation(null)
        resetForm()
    }

    return (
    <DialogBasic isOpen={dialogObservationIsOpen} handleOpenDialog={handleOpenDialog}>
        <DialogTitle>Ultima Observación</DialogTitle>
        <DialogContent>
            <Stack spacing={2} gap={2} marginY={2}>
                        <TextField fullWidth multiline rows={8} label="Observación" name="observation" onChange={handleChange} value={values.observation}/>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <LoadingButton
                                onClick={(e) => handleSubmit()}
                                loading={isSubmitting}
                                loadingPosition="start"
                                startIcon={<Save />}
                                variant="outlined"
                                >
                                Guardar
                            </LoadingButton>
                        </Box>
            </Stack>
        </DialogContent>
    </DialogBasic>
    )
}
