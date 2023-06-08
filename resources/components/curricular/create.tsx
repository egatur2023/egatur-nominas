import { Alert, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from "@api";
import { Box } from "@mui/system";
import {  DtoCreateCurricular } from "./../../types.d";
import { useFormik } from "formik";
import { schemaCurricular } from "resources/validation/schema.create.curricular";
import { MONTHS } from "resources/constants";
import { useState } from "react";
import { useStoreCurricular } from "resources/local/store.curricular";

type PropsCreateCurricular = {
    fnOnCreate: (isOpen: boolean) => void
}

export default function CreateCurricular({ fnOnCreate }: PropsCreateCurricular) {
    const { selectedCareer } = useStoreCurricular()
    const [message , setMessage ] = useState<string>("")
    const { values :    curricular,
                        touched,
                        errors,
                        setSubmitting,
                        isSubmitting,
                        handleSubmit,
                        handleChange  } = useFormik<DtoCreateCurricular>({

        validationSchema : schemaCurricular,
        initialValues : {
            careerId: selectedCareer?.id || 0,
            month: "ENERO",
            isRegular: false,
            year: (new Date().getFullYear()).toString()
        },
        onSubmit(validatedCurricular) {
            mutation.mutate(validatedCurricular)//enviar post y actualizar automaticamente la lista
            setSubmitting(true)
        },
    })
    const queryClient = useQueryClient()
    const mutation = useMutation(API.postCurricular, {
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["curriculars"])
            fnOnCreate(false)//cerrar modal
        },
        onError(error : any){
            setSubmitting(false)
            setMessage(error?.response.data.message as string)
        }
    })


    return (
        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h5">Nueva Malla Curricular</Typography>
                    {
                        mutation.isError &&
                        <Alert severity="error">{message}</Alert>
                    }
                    <TextField
                        disabled
                        id="txfCareer"
                        size="small"
                        label="Carrera"
                        defaultValue={selectedCareer?.name}
                        InputProps={{
                            readOnly: true,
                            disabled : true
                        }}
                    />

                    <TextField
                        size="small"
                        fullWidth
                        name="year"
                        type="number"
                        label="Año"
                        defaultValue={curricular.year}
                        error={touched.year && Boolean(errors.year)}
                        helperText={touched.year && errors.year}
                        onChange={handleChange}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="lblIsRegular">Mes</InputLabel>
                        <Select
                            labelId="lblIsRegular"
                            name="month"
                            value={curricular.month}
                            label="Mes"
                            onChange={handleChange}
                        >
                            {
                                MONTHS.map((month, index) =>
                                    <MenuItem key={index} value={month}> {month} </MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>



                    <FormControl fullWidth>
                        <InputLabel id="lblIsRegular">Tipo</InputLabel>
                        <Select
                            labelId="lblIsRegular"
                            name="isRegular"
                            id="demo-simple-select"
                            defaultValue={curricular.isRegular ? 1 : 0}
                            label="Tipo"
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>Regular</MenuItem>
                            <MenuItem value={0}>Irregular</MenuItem>
                        </Select>
                    </FormControl>
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            disabled={isSubmitting}
                            onClick={ e => {
                                //@ts-ignore
                                handleSubmit(e)
                            }}
                        >Crear</Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}
