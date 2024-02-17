import { useStoreUser } from "resources/local/store.user";
import DialogBasic from "../dialog.basic";
import { DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { Role, User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@api";
import { ResultGetRoles, UserWithRole } from "resources/types";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";

export function UserEdit(){

    const qc = useQueryClient()
    const { userToEdit , setIsOpenEdit , isOpenEdit , setUserToEdit } = useStoreUser()
    const { data : roles } = useQuery<ResultGetRoles>({
        queryKey : ["roles"],
        queryFn : API.fetchRoles,
        initialData : [],
    })
    const mutation = useMutation({
        mutationFn : API.putUser,
        onSuccess : () => {
            setSubmitting(false)
            setIsOpenEdit(false)
            setUserToEdit(null)
            qc.invalidateQueries(["api/users"])
        },
        onError(error, variables, context) {
            setSubmitting(false)
            console.log(error)
        },
    })
    const { values , setSubmitting , isSubmitting , setFieldValue ,handleSubmit } = useFormik<User>({
        initialValues : {
            id : userToEdit?.id || 0,
            email : userToEdit?.email || "",
            username : userToEdit?.username || "",
            password : userToEdit?.password || "",
            roleId : userToEdit?.roleId || 0,
        },
        onSubmit : async (validatedValues) => {
            mutation.mutate(validatedValues)
        },
        enableReinitialize : userToEdit !== null
    })

    return (<>
        <DialogBasic
            isOpen={isOpenEdit}
            handleOpenDialog={(isOpen : boolean) => {
                setIsOpenEdit(isOpen)
                setUserToEdit(null)
            }}
        >
            <DialogTitle>
                Editar usuario
            </DialogTitle>
            <DialogContent dividers>
            <Stack gap={2}>
                <TextField value={values.username}/>
                <TextField value={values.email}/>
                <FormControl>
                    <Select
                        value={values.roleId}
                        onChange={(event: SelectChangeEvent<number>) => {
                            setFieldValue("roleId", event.target.value)
                        } }
                    >

                        {
                            roles.map(role => (
                                <MenuItem key={`MI${role.id}`} value={role.id} selected={role.id === values.roleId}>
                                    {role.name}
                                </MenuItem>
                            ))
                        }

                    </Select>
                </FormControl>
            </Stack>
            </DialogContent>
            <DialogActions sx={{ px : 3 }}>
                    <LoadingButton
                        variant="outlined"
                        loading={isSubmitting}
                        endIcon={<Save fontSize="small"/>}
                        onClick={() => handleSubmit()}
                    >
                        Guardar
                    </LoadingButton>
                </DialogActions>
        </DialogBasic>
    </>)
}
