import { Table, TData, THead, TRow } from "resources/components.pdf";
import { ResultSubsRoomReportByAdmission } from "resources/types";

export function AttendanceReportByAdmission({students }:{students : ResultSubsRoomReportByAdmission}){

    return (
        <>
            <div style={{ maxHeight : "108mm" }}>
                <div style={{ display : "flex" , height : "12mm" }}>
                    <img src="/logo.png" alt="LOGO" style={{ width : "90px" , height : "6mm" }} />
                    <h1 style={{ fontSize : "5rem" }}>REPORTE ASISTENCIAS POR AULAS</h1>
                </div>

                <Table>
                    <thead>
                        <TRow>
                            <THead>N°</THead>
                            <THead>NOMBRES Y APELLIDOS</THead>
                            <THead>ADMISION</THead>
                            <THead>TURNO</THead>
                            <THead>CARRERA</THead>
                            <THead>MALLA</THead>
                            <THead>MÓDULO</THead>
                            <THead>CURSO</THead>
                            <THead>DOCENTE</THead>
                            <THead>NOTAS</THead>
                        </TRow>
                    </thead>
                    <tbody>
                        {//se rompe a las 22 filas
                            Object.keys(students).map(( studentId, index) => {
                                const student = students[studentId]
                                return (
                                    <TRow key={`TRRR${index}`}>
                                        <TData>{++index}</TData>
                                        <TData>{student.studentFullName}</TData>
                                    </TRow>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        </>
    )
}
