import API from "@api";
import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Career } from "@prisma/client";
import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DtoEditCareer } from "resources/types";
import { useFormik } from "formik";
import { schemaCareer } from "resources/validation/schema.create.career";
import { AxiosError } from "axios";


type PropsEditCareer = {
    fnOnEdit : (isOpen : boolean) => void
    careerToEdit : Career
}

export default function EditCareer({fnOnEdit , careerToEdit} : PropsEditCareer){
    const queryClient = useQueryClient()
    const [messageError , setMessageError] = useState<string>("")
    const { values : career,isSubmitting,setSubmitting,touched, errors, handleChange , handleSubmit } = useFormik<DtoEditCareer>({
        initialValues : {
            id : careerToEdit.id ,
            name : careerToEdit.name
        },
        validationSchema: schemaCareer,
        onSubmit(validatedCareer){
            mutation.mutate(validatedCareer)//enviar post y actualizar automaticamente la lista
            setSubmitting(true)
        }
    })

    const mutation = useMutation(API.putCareer,{
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["careers"])
            setSubmitting(false)
            fnOnEdit(false)//cerrar modal
        },
        onError : (error : any ) => {
            setSubmitting(false)
            setMessageError(error?.response?.data?.message as string)
        }
    })

    return (

        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h6">Editar</Typography>
                    {
                        mutation.isError &&
                        <Alert  severity="error">{messageError}</Alert>
                    }
                    <TextField
                        id="txfCareer"
                        size="small"
                        label="Carrera"
                        name="name"
                        onChange={ handleChange }
                        value={career.name}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                    />
                    <Box display="flex" justifyContent="flex-end">
                    {/* // @ts-ignore */}
                        <Button
                        variant="contained"
                        disabled={isSubmitting}
                        onClick={e => {
                            //@ts-ignore
                            handleSubmit(e)
                        }}
                        >Editar</Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}
