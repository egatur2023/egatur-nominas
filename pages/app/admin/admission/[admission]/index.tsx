import API from "@api"
import { CalendarMonth, Edit, FileDownload, NavigateNext } from "@mui/icons-material"
import { Box, Breadcrumbs, Button, Card, CardContent, Chip, Divider, IconButton, List, ListItem, ListSubheader, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { GroupedResult, ResultGetSubscriptionsRoomByAdmission } from "resources/types"

export default function AdmissionsPage(){
    const getColorByState = useMemo(()=>{
        return (state : string) => {
            const states : {[key : string] : string} = {
                "PENDIENTE" : "#dedede",
                "ASISTIO" : "#3f50b5",
                "FALTO" : "#ffa726",
                "TARDANZA" : "#388e3c",
                "JUSTIFICADA" : "#f44336",
                "NO_VINO_EL_DOCENTE" : "#66bb6a",
                "FERIADO" : "#0288d1",
            }
            return states[state]
        }
    },[])
    const getAbbreviature = useMemo(()=>{
        return (state : string) => {
            const states : {[key : string] : string} = {
                "PENDIENTE" : "P",
                "ASISTIO" : "A",
                "FALTO" : "F",
                "TARDANZA" : "T",
                "JUSTIFICADA" : "J",
                "NO_VINO_EL_DOCENTE" : "NVD",
                "FERIADO" : "FE",
            }
            return states[state]
        }
    },[])

    const router = useRouter()
    const admission : string = router.query.admission ? String(router.query.admission as string) : "";
    const { data : result , isLoading } = useQuery<{ admissions : GroupedResult , coursesNames :string[] }>({
            queryKey : ['api/admission/[admission]', admission],
            queryFn : async () => await API.fetchAdmissionsByAdmission(admission),
            initialData : { admissions : {} , coursesNames : []},
            enabled : admission.length > 0,
            onSuccess(data) {
                // Object.keys(data).map((key) =>  )
                console.log({courses : data.coursesNames})
            },
        })

    const pdf = (
        new jsPDF({
            format: "A4",
            unit: "mm",
            orientation: "portrait",
        })
    )

    const handleDownloadReportAssistance = () => {

        autoTable(pdf,{
            theme: "plain",
            styles : { fontSize : 12, halign : "center"},
            head : [[`Reporte de asistencia por admisión - ${admission}`]],
        })

        Object.keys(result.admissions).map((keyStudentId) => {
            const student = result.admissions[keyStudentId]
            autoTable(pdf,{
                theme: "plain",
                head : [[student.studentFullName]],
            })
            student.courses.map((subscriptionCourse,index) => {

                autoTable(pdf,{
                    showHead: 'everyPage',
                    styles : { fontSize : 7, lineColor : [0,0,0], lineWidth : 0.1 ,fillColor : [255,255,255],textColor : [0,0,0]},
                    margin :  { top : 10},
                    theme : "grid",
                    head : [
                        [{ content : subscriptionCourse.courseName , colSpan : subscriptionCourse.attendances.length}],
                        subscriptionCourse.attendances
                            .map(at =>
                                ({
                                    content : new Date(at.date).toLocaleDateString('es-ES',{year : 'numeric', month : 'numeric', day : 'numeric'}),
                                    styles : { halign : "center" }
                                })
                            )
                    ],
                    body : [subscriptionCourse.attendances.map(at => ({
                        content : getAbbreviature(at.stateAttendance),
                        styles : { fillColor : getColorByState(at.stateAttendance) , halign : "center"}
                    }))]
                })
            })
        })
        pdf.save(`report_admission_${admission}.pdf`)
        // filePDF.setFontSize(1)
        // filePDF.html(renderToStaticMarkup(<Assistance subRooms={dataReport1}/>),{
        //     margin:  [20,20,20,20] ,
        //     callback : () => {
        //         filePDF.save("reporte_general.pdf")
        //     }
        // })
    }

    if(isLoading){
        return <Typography variant="h6" align="center">Cargando...</Typography>
    }

    return (<Stack>
        <Breadcrumbs
            sx={{ mb : 4 }}
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
            >
            <Typography key="3" color="text.secondary">
                Asistencia por admisión
            </Typography>
            <Typography key="3" color="text.primary">
            {admission}
            </Typography>

        </Breadcrumbs>
        <Box width="100%" sx={{ mb : 4 , display : "flex" , justifyContent : "flex-end"}}>
            <Button
                variant="outlined"
                endIcon={<FileDownload/>}
                // href={`/api/admission/${admission}/report`}
                // target="_blank"
                onClick={() => handleDownloadReportAssistance()}
            >
                Descargar
            </Button>
        </Box>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                        <TableCell sx={{ fontWeight : "bold"}} align="left">ESTUDIANTE</TableCell>

                            {
                                result.coursesNames.map((courseName) => (
                                    <TableCell key={courseName} sx={{ fontWeight : "bold"}} align="center">{courseName}</TableCell>
                                ))
                            }
                        </TableRow>
                        </TableHead>
                        <TableBody>
            {
                Object.keys(result.admissions).length > 0 ? Object.keys(result.admissions).map((keyStudentId) => (

                    <TableRow
                        key={keyStudentId}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {result.admissions[keyStudentId].studentFullName}
                        </TableCell>
                        {
                            result.admissions[keyStudentId].courses.map((subscriptionCourse,index) => (
                                <TableCell key={`${keyStudentId}-${subscriptionCourse.id}`} align="center">
                                    <IconButton
                                        onClick={
                                            () => {
                                                const registerStudent = result.admissions[keyStudentId].courses.find(c => c.courseName == result.coursesNames[index])
                                                router.push(`/app/admin/register/${registerStudent?.subscriptionModule.register.id}/attendance/${registerStudent?.id}`)
                                            }
                                        }
                                    >
                                        <CalendarMonth/>
                                    </IconButton>
                                </TableCell>
                            ))
                        }

                    </TableRow>

                ))
                : <TableRow><TableCell colSpan={result.coursesNames.length + 1}><Typography variant="h6" align="center">No hay resultados</Typography></TableCell></TableRow>
            }
            </TableBody>
            </Table>
        </TableContainer>

    </Stack>)
}
