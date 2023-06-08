import API from "@api";
import { Alert, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DtoEditCareer, DtoEditModule } from "resources/types";
import { useFormik } from "formik";
import { schemaModule } from "resources/validation/schema.create.modulo";

interface PropsEditModule {
    fnOnEdit : (isOpen : boolean) => void
    moduleToEdit : DtoEditModule
}

export default function EditModule({fnOnEdit , moduleToEdit} : PropsEditModule){
    const queryClient = useQueryClient()
    const [message, setMessage] = useState<string>("")
    const mutation = useMutation(API.putModule,{
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["modules"])
            fnOnEdit(false)//cerrar modal
            setSubmitting(false)
        },
        onError(error : any) {
            setMessage(error?.response.data.message as string)
            setSubmitting(false)
        },
    })

    const { values : module,isSubmitting , touched , setSubmitting , errors , handleChange , handleSubmit} = useFormik<DtoEditModule>({
        validationSchema : schemaModule ,
        initialValues : {
            id : moduleToEdit.id ,
            name : moduleToEdit.name,
        },
        onSubmit(validatedModule){
            mutation.mutate(validatedModule)//enviar post y actualizar automaticamente la lista
        }
    })

    return (

        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h6">Editar</Typography>
                    {
                        mutation.isError &&
                        <Alert severity="error">{message}</Alert>
                    }
                    <TextField
                        size="small"
                        label="Modulo"
                        name="name"
                        onChange={handleChange}
                        value={module.name}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                    />

                    <Box display="flex" justifyContent="flex-end">
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
