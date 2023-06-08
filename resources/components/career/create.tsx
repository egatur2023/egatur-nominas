import { Alert, Autocomplete, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useContext, useState } from "react"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "@api";
import { Box } from "@mui/system";
import { DtoCreateCareer } from "./../../types.d";
import { useFormik } from "formik";
import { schemaCareer } from "resources/validation/schema.create.career";
import { AxiosError } from "axios";

type PropsCreateCareer = {
    fnOnCreate :  (isOpen : boolean) => void
}

export default function CreateCareer({fnOnCreate} : PropsCreateCareer){

    const queryClient = useQueryClient()
    const [messageError , setMessageError] = useState<string>("")
    const {mutate , isError} = useMutation(API.postCareer,{
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["careers"])
            formik.setSubmitting(false)
            fnOnCreate(false)
        },
        onError : (error : any ) => {
            formik.setSubmitting(false)
            setMessageError(error?.response?.data?.message as string)
        }
    })

    const formik = useFormik<DtoCreateCareer>({
        initialValues : { name : ""},
        validationSchema : schemaCareer,
        onSubmit : (values , {setSubmitting}) => {
            mutate(values)//enviar post y actualizar automaticamente la lista
            setSubmitting(true)
        },
    })


    return (
        <Card variant="outlined">
                <CardContent>
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={2}>
                            <Typography variant="h5">Nueva Carrera</Typography>
                            {
                                isError &&
                                <Alert  severity="error">{messageError}</Alert>
                            }
                            <TextField
                                id="txfCareer"
                                name="name"
                                size="small"
                                label="Carrera"
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                            <Box display="flex" justifyContent="flex-end">
                                <Button disabled={formik.isSubmitting} variant="contained" type="submit">Crear</Button>
                            </Box>
                    </Stack>
                </form>
                </CardContent>
            </Card>
    )
}
