import API from "@api";
import { SaveAlt } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useStoreRole } from "resources/local/store.role";
import { DtoCreateRole } from "resources/types";
import DialogBasic from "../dialog.basic";

export default function RoleCreate(){

    const { isOpenCreate,setIsOpenCreate } = useStoreRole()
    const qc = useQueryClient()
    const mutation = useMutation(
        API.postRole,
        {
            onSuccess : () => {
                setSubmitting(false)
                qc.invalidateQueries(["api/roles"])
                setIsOpenCreate(false)
            },
            onError : (error) => {
                setSubmitting(false)
                console.log(error)
            }
        }
    )

    const { values , handleChange , handleSubmit , setSubmitting} = useFormik<DtoCreateRole>(
    {
        initialValues : {
            name : "SUPERVISOR"
        },
        onSubmit : async (values) => {
            await mutation.mutate(values)
        }
    })

    return (
        <DialogBasic isOpen={isOpenCreate} handleOpenDialog={setIsOpenCreate}>
            <DialogTitle>Nuevo rol</DialogTitle>
            <DialogContent>
                <Stack gap={2}>
                    <TextField label="Rol" name="name" onChange={handleChange}/>

                </Stack>
            </DialogContent>
            <DialogActions>
                <Box justifyContent="flex-end" display="flex" width="100%">
                    <LoadingButton endIcon={<SaveAlt fontSize="small"/>} onClick={() => handleSubmit()}>
                        Crear
                    </LoadingButton>
                </Box>
            </DialogActions>
        </DialogBasic>
    )
}
