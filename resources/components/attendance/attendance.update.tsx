import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, Stack, TextField, TextareaAutosize, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import DialogBasic from "../dialog.basic";
import { useFormik } from "formik";
import { Attendance, AttendanceState } from "@prisma/client";
import { DateTime } from "luxon";
import { LoadingButton } from "@mui/lab";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@api";
import { useStoreAttendanceStudent } from "resources/local/store.attendance.student";
import { DtoUpdateAttendance } from "resources/types";

type AttendanceUpdateProps = {
    isOpen: boolean,
    handleIsOpen : (isOpen : boolean) => void
    attendance : Attendance | null
}


export default function AttendanceUpdate({handleIsOpen , isOpen , attendance} : AttendanceUpdateProps){

    const { setAttendanceToEdit , setOpenDialogEditAttendance } = useStoreAttendanceStudent()
    const qc = useQueryClient()
    const { values : valuesAttendance , handleSubmit ,handleChange , errors,isSubmitting , setSubmitting , setFieldValue } = useFormik<DtoUpdateAttendance>({
        initialValues : {
            attendanceId : attendance?.id || 0,
            date : attendance?.date.toString() || "2024-01-01",
            stateAttendance : attendance ? attendance?.stateAttendance : "PENDIENTE",
            observation : attendance? attendance.observation : ""
        },
        onSubmit(values, formikHelpers) {
            mutation.mutate(values)
        },
        enableReinitialize : attendance != null
    })

    const mutation = useMutation(API.putAssistanceOnSubRoom, {
        onSuccess: (valuesUpdated) => {
            setSubmitting(false)
            setAttendanceToEdit(null)
            setOpenDialogEditAttendance(false)
            qc.invalidateQueries(["api/register/[register_id]/attendance/[subroom_id]",attendance?.subscriptionRoomId])
        },
        onError: (error) => {
            setSubmitting(false)
            console.log(error)
        }
    })

    return (<>
        <DialogBasic responsive={true} handleOpenDialog={handleIsOpen} isOpen={isOpen}>
            <Card>
                <CardContent>
                    <Stack spacing={2} gap={1}>
                        <Typography variant="h5">Asignar asistencia</Typography>
                        <TextField
                                variant="outlined"
                                label="Fecha Inicio"
                                type="date"
                                size="small"
                                name="date"
                                value={attendance != undefined || attendance != null ? DateTime.fromISO(valuesAttendance.date).toUTC().toISODate() : ""}
                                onChange={e => {
                                    setFieldValue("date",e.target.value)
                                }}
                            />

                        <RadioGroup
                            defaultValue={attendance?.stateAttendance || "PENDIENTE"}
                            sx={{ display : "flex" , flexDirection : "row" }}
                            name="stateAttendance"
                            onChange={handleChange}
                        >
                            {
                                Object.keys(AttendanceState).map((stateName) => (
                                    <FormControlLabel  key={stateName} control={<Radio size="small" />} value={stateName} label={<Typography variant="caption">{stateName.replaceAll("_"," ")}</Typography>}/>
                                ))
                            }
                        </RadioGroup>

                        <TextField
                        multiline
                        rows={6}
                        name="observation"
                        label="Observación"
                        value={valuesAttendance.observation}
                        onChange={ e => handleChange(e)} />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <LoadingButton
                                onClick={(e) => handleSubmit()}
                                loading={isSubmitting}
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="outlined"
                                >
                                Guardar
                            </LoadingButton>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </DialogBasic>
    </>)
}
