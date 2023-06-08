import { Alert, Autocomplete, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "@api";
import { Box } from "@mui/system";
import { DtoCreateModule } from "./../../types.d";
import { useFormik } from "formik";
import { schemaModule } from "resources/validation/schema.create.modulo";
import { useStoreCurricular } from "resources/local/store.curricular";

type PropsCreateModule = {
    fnOnCreate: (isOpen: boolean) => void
}
export default function CreateModule({ fnOnCreate }: PropsCreateModule) {
    const { selectedCurricular } = useStoreCurricular()
    const [message, setMessage] = useState<string>("")
    const { values: module,
        touched,
        errors,
        setSubmitting,
        isSubmitting,
        handleSubmit,
        handleChange } = useFormik<DtoCreateModule>({

            validationSchema: schemaModule,
            initialValues: {
                curricularId: selectedCurricular?.id || 0,
                name: "",
            },
            onSubmit(validatedModule) {
                mutation.mutate(validatedModule)
                setSubmitting(true)
            },
        })


    const queryClient = useQueryClient()
    const mutation = useMutation(API.postModule, {
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["modules"])
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
                    <Typography variant="h5">Nuevo Módulo</Typography>
                    {
                        mutation.isError &&
                        <Alert severity="error">{message}</Alert>
                    }
                    <TextField
                        id="txtCurricular"
                        size="small"
                        label="Malla curricular"
                        defaultValue={selectedCurricular?.code}
                        InputProps={{
                            readOnly: true,
                            disabled: true,
                        }}
                    />

                    <TextField
                        name="name"
                        size="small"
                        fullWidth
                        type="text"
                        label="Nombre"
                        defaultValue={module.name}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        onChange={handleChange}
                    />

                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            disabled={isSubmitting}
                            onClick={e => {
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
