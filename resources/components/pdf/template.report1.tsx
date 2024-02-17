import { Table, TData, THead, TRow } from "resources/components.pdf";
import { UI } from "resources/constants";
import { DtoDataReportRow } from "resources/types";

function getGroups16(_subRooms : DtoDataReportRow[]) {
    let subRooms = [..._subRooms]
    const firstGroup = subRooms.splice(0,17)
    const quantity = Math.ceil(subRooms.length / 19)
    const groups = new Array(quantity).fill(0).map( _ => subRooms.splice(0,19))
    return { groups , firstGroup  }
  }

export default function TemplateReport1({subRooms = []} : { subRooms : DtoDataReportRow[]}){

    const { groups , firstGroup } = getGroups16(subRooms)


    return (
        <>
            <div style={{ maxHeight : "108mm" }}>
                <div style={{ display : "flex" , width: UI.PDF.maxWdith.landscape , height : "12mm" }}>
                    <img src="/logo.png" alt="LOGO" style={{ width : "90px" , height : "6mm" }} />
                    <div style={{ display :"flex" , flexDirection : "column" , alignItems : "center" , justifyContent : "center", height : "8mm" , width : `calc(${UI.PDF.maxWdith.landscape} - 90px)` ,paddingRight : "90px"}}>
                        <div style={{ fontSize : "0.5rem" }}>REPORTE DE REGISTRO GENERAL</div>
                        <div style={{ fontSize : "0.4rem" }}>DESDE <span>--/--/--</span>  HASTA <span>--/--/--</span></div>
                    </div>
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
                            firstGroup && firstGroup?.map((subRoom , index : number) => (
                                <TRow key={`TRRR${index}`}>
                                    <TData>{++index}</TData>
                                    <TData>{subRoom.studentFullName}</TData>
                                    <TData>{subRoom.admision}</TData>
                                    <TData>{subRoom.schedule}</TData>
                                    <TData>{subRoom.careerName}</TData>
                                    <TData>{subRoom.curricularName}</TData>
                                    <TData>{subRoom.moduleName}</TData>
                                    <TData>{subRoom.courseName}</TData>
                                    <TData>{subRoom.teacherFullName}</TData>
                                    <TData>{subRoom.score}</TData>
                                </TRow>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
            {
                groups && groups.map((subRooms , index) => (
                    <div style={{ maxHeight : "108mm" }} key={`${index}${subRooms.length}`}>
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
                                    subRooms && subRooms?.map((subRoom , index : number) => (
                                        <TRow key={`TRRR${index}`}>
                                            <TData>{++index}</TData>
                                            <TData>{subRoom.studentFullName}</TData>
                                            <TData>{subRoom.admision}</TData>
                                            <TData>{subRoom.schedule}</TData>
                                            <TData>{subRoom.careerName}</TData>
                                            <TData>{subRoom.curricularName}</TData>
                                            <TData>{subRoom.moduleName}</TData>
                                            <TData>{subRoom.courseName}</TData>
                                            <TData>{subRoom.teacherFullName}</TData>
                                            <TData>{subRoom.score}</TData>
                                        </TRow>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </div>
                ))
            }
        </>
    )
}
