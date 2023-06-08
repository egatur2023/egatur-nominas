import API from "@api"
import { Table, TableCell, TableRow, TableHead, TableBody, Box, CircularProgress } from "@mui/material"
import { useState } from "react"
import { useQuery } from '@tanstack/react-query'
import { DtoDataReportRow, DtoFilterReport } from "resources/types"
import { useStoreReport } from "resources/local/store.report"


type PropsReportDate = {
    params: DtoFilterReport
}

export default function ReportData({ params }: PropsReportDate) {

    const { setDateReport1 } = useStoreReport()
    const { data: subRooms, isFetching } = useQuery<DtoDataReportRow[]>(
        ["report", params],
        async () => API.postReport(params),
        {
            onSuccess(data) {
                setDateReport1(data)
            }
        }
    )

    if (isFetching) {
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
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>N°</TableCell>
                    <TableCell>NOMBRES Y APELLIDOS</TableCell>
                    <TableCell>ADMISION</TableCell>
                    <TableCell>TURNO</TableCell>
                    <TableCell>CARRERA</TableCell>
                    <TableCell>MALL</TableCell>
                    <TableCell>MODULO</TableCell>
                    <TableCell>CURSO</TableCell>
                    <TableCell>DOCENTE</TableCell>
                    <TableCell>NOTAS</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    subRooms && subRooms?.map((subRoom, index) => (
                        <TableRow key={`TRRR${index}`}>
                            <TableCell>{++index}</TableCell>
                            <TableCell>{subRoom.studentFullName}</TableCell>
                            <TableCell>{subRoom.admision}</TableCell>
                            <TableCell>{subRoom.schedule}</TableCell>
                            <TableCell>{subRoom.careerName}</TableCell>
                            <TableCell>{subRoom.curricularName}</TableCell>
                            <TableCell>{subRoom.moduleName}</TableCell>
                            <TableCell>{subRoom.courseName}</TableCell>
                            <TableCell>{subRoom.teacherFullName}</TableCell>
                            <TableCell>{subRoom.score}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}
