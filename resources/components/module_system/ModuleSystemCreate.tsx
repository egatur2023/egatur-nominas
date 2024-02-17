import API from '@api'
import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { MODULES } from 'resources/constants'
import { useStoreModuleSystem } from 'resources/local/store.module.system'
import { DtoCreateModuleSystem } from 'resources/types'
import { schemaModuleSystem } from 'resources/validation/schema.create.module.system'
export function ModuleSystemCreate(){

    const { setIsOpenCreate } = useStoreModuleSystem()
    const qc = useQueryClient()
    const mutation = useMutation(API.postModuleSystem, {
        onSuccess: (updatedValues) => {
            setSubmitting(false)
            qc.invalidateQueries(["api/ms"])
            setIsOpenCreate(false)
        },
        onError: (error) => {
            setSubmitting(false)
            console.log(error)
        }
    })

    const { values, isSubmitting ,setFieldValue , setSubmitting ,handleSubmit} = useFormik<DtoCreateModuleSystem>({
        validationSchema : schemaModuleSystem,
        initialValues : { name : ""},
        onSubmit : (values) => {
            mutation.mutate(values)
        }
    })

    return (
        <Stack padding={4} spacing={2}>
            <FormControl>
                    <InputLabel>Nombre Módulo</InputLabel>
                    <Select
                        name="name"
                        label="Nombre Módulo"
                        value={values.name}
                        onChange={(event: SelectChangeEvent<string>) => {
                            setFieldValue("name", event.target.value)
                        } }
                    >
                        {
                            Object.entries(MODULES).map(([key,value] : [string,string]) => (
                                <MenuItem key={`MI${value}`} value={value}>
                                    {value}
                                </MenuItem>
                            ))
                        }

                    </Select>
                </FormControl>
            <Box display="flex" justifyContent="flex-end">
                <LoadingButton
                    loading={isSubmitting}
                    endIcon={<Save fontSize='small'/>}
                    onClick={() => handleSubmit()}
                    >Crear</LoadingButton>
            </Box>
        </Stack>
    )
}
