import { Alert, Autocomplete, Button, CircularProgress, IconButton, InputAdornment, Stack, TextField } from "@mui/material"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "@api";
import { Box } from "@mui/system";
import { DtoCreateRegister } from "../../types";
import { Add } from "@mui/icons-material";
import { DateTime } from "luxon";
import { Career, CurricularStructure , Student } from "@prisma/client";
import DialogFullScreen from "../dialog.fullscreen";
import { useFormik } from "formik";
import { schemaCreateRegister } from "resources/validation/schema.create.register";
import { SCHEDULES } from "resources/constants";
import { useStoreRegister } from "resources/local/store.register";


export default function DialogCreateRegister() {
    const queryClient = useQueryClient()
    const { data: students, isLoading: isStudentListLoading } = useQuery<Student[]>(["students"], async () => API.getStudents() , {
        initialData : []
    })
    const { data: careers, isLoading: isCareersLoading } = useQuery<Career[]>(["careers"], async () => API.getCareers() , { refetchOnWindowFocus : false })
    const { data: curriculars, isLoading: isCurricularsLoading } = useQuery<CurricularStructure[]>(["curriculars"], async () => API.getCurriculars())
    const [curricularsFiltered , setCurricularsFiltered] = useState<CurricularStructure[]>([])
    const { isOpenDialogCreateRegister , setOpenDialogRegister , setOpenDialogStudent } = useStoreRegister()
    const [message , setMessage] = useState<string>("")
    const {
        values : register,
        isSubmitting ,
        setSubmitting ,
        setFieldValue ,
        touched ,
        errors,
        handleChange ,
        handleSubmit
    } = useFormik<DtoCreateRegister>({
        validationSchema : schemaCreateRegister ,
        initialValues : {
            careerId : 0,
            curricularId : 0,
            studentId : 0,
            dateStart : DateTime.now().toUTC().toISODate(),
            scheduleAdmision : "MAÑANA",
        },
        onSubmit(validatedRegister){
            mutation.mutate(validatedRegister)//enviar post y actualizar automaticamente la lista
            setSubmitting(true)
        },
    })

    const mutation = useMutation(API.postRegister, {
        onSuccess(response) {
            queryClient.invalidateQueries(["registers"])
            setSubmitting(false)
            setOpenDialogRegister(false)
        },
        onError(error : any){
            setMessage(error?.response?.data?.message as string)
            setSubmitting(false)
        }
    })


if (isStudentListLoading  || isCareersLoading) {
    return <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"100vh"}
    >
        <CircularProgress></CircularProgress>
    </Box>
}

    return (
        <DialogFullScreen
            isOpen={isOpenDialogCreateRegister}
            handleClose={()=> setOpenDialogRegister(false)}
            renderButton={
                <Button
                    variant="outlined"
                    disabled={isSubmitting}
                    onClick={ e => {
                        //@ts-ignore
                        handleSubmit(e)
                    }}
                >Crear</Button>
            }
            title="Nuevo registro"
        >
                <Stack spacing={2} sx={{ mt : 1 , p : 4 }}>
                    {
                        mutation.isError &&
                        <Alert severity="error">{message}</Alert>
                    }
                    <Autocomplete
                        size="small"
                        options={students}
                        getOptionLabel={option => (option.fullName as string)}
                        onChange={(_,student)=>  setFieldValue("studentId",student?.id , true)}
                        renderInput={
                            (params) =>
                            <TextField
                                {...params}
                                name="studentId"
                                required
                                error={touched.studentId && Boolean(errors.studentId)}
                                helperText={touched.studentId && errors.studentId}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (<>
                                        <InputAdornment position="end">
                                            <IconButton size="small"
                                                onClick={
                                                    () => {
                                                        setOpenDialogStudent(true)
                                                        setOpenDialogRegister(false)
                                                    }
                                                }
                                            >
                                                <Add fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    </>)
                                }}
                                label="Estudiante"
                            />
                        }
                    />

                    <Autocomplete
                        options={careers|| []}
                        fullWidth
                        getOptionLabel={option => (option.name as string)}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                error={touched.careerId && Boolean(errors.careerId)}
                                helperText={touched.careerId && errors.careerId}
                                name="careerId"
                                label="Carrera"
                            />
                        }
                        onChange={(e,career)=> {
                            setFieldValue("careerId" , career?.id , true)
                            let filtered = curriculars?.filter(c => c.careerId == career?.id)
                            setCurricularsFiltered(filtered||[])
                        }}
                    />

                    <Autocomplete
                        options={curricularsFiltered}
                        fullWidth
                        getOptionLabel={option => (option.code as string)}
                        renderInput={(params) =>
                        <TextField
                            {...params}
                            error={touched.curricularId && Boolean(errors.curricularId)}
                            helperText={touched.curricularId && errors.curricularId}
                            name="curricularId"
                            label="Malla Curricular"
                        />
                    }
                        onChange={(e,curricular)=> setFieldValue("curricularId" , curricular?.id , true)}
                    />

                    <TextField
                        variant="outlined"
                        name="dateStart"
                        label="Fecha Inicio"
                        type="date"
                        onChange={handleChange}
                        defaultValue={register.dateStart}
                    />

                    <Autocomplete
                        size="small"
                        options={SCHEDULES}
                        value={register.scheduleAdmision}
                        onChange={(e,schedule)=> setFieldValue("scheduleAdmision" , schedule , true)}
                        getOptionLabel={option => (option as string)}
                        renderInput={(params) => <TextField  name="scheduleAdmision" {...params} label="Turno"/>}
                    />
                </Stack>
        </DialogFullScreen>
    )
}
