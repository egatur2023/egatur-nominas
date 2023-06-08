import { UI } from "resources/constants";
import {  DtoResRegisterWithSubRooms } from "resources/types";

export function TemplateRegistersPDF({ register }: { register: DtoResRegisterWithSubRooms }) {

    const styleRow: React.CSSProperties = {
        border: "0.5px solid black",
        fontSize: "8px"
    }
    const styleCellHeader: React.CSSProperties = {
        borderRight: "0.5px solid black",
        fontSize: "8px",
        borderCollapse: "collapse",
        borderStyle: "collapse"
    }
    const styleCellBody: React.CSSProperties = {
        padding: "0.25rem 0.5rem",
        fontSize: "7px"
    }

    return (
        <>
            <div style={{ display: "flex", width: UI.PDF.maxWdith.portrait , justifyContent: "space-between", alignItems:"center" }}>
                <img src="/logo.png" style={{ width: "20mm", height: "5mm" }} />
                <p style={{ width:"60mm", fontSize: "15px", fontWeight: "bold" ,textTransform : "uppercase" }}>Record Académico</p>
            </div>

            <hr style={{ border: "0.3px solid gray", padding: "0px 10px", width: UI.PDF.maxWdith.portrait }} />

            <table style={{ borderCollapse: "collapse", margin: "10px 0px 20px 0px", borderStyle: "collapse", fontSize: "5px", fontFamily: "arial", width: UI.PDF.maxWdith.portrait }}>
                <tbody style={{ fontSize: "8px"}}>
                    <tr style={{ width: UI.PDF.maxWdith.portrait }}>
                        <td style={{ width: "20mm" }} >Nombre y Apellidos:</td>
                        <td style={{ width: "80mm" }}>{register.fullName}</td>
                    </tr>
                    <tr style={{ width: UI.PDF.maxWdith.portrait }}>
                        <td style={{ width: "20mm" }} >Admision:</td>
                        <td style={{ width: "80mm" }}>{register.dateAdmision}</td>
                    </tr>
                    <tr style={{ width: UI.PDF.maxWdith.portrait }}>
                        <td style={{ width: "20mm" }} >Malla Curricular:</td>
                        <td style={{ width: "80mm" }}>{register.scheduleAdmision}</td>
                    </tr>
                </tbody>
            </table>


            <table style={{ borderCollapse: "collapse", borderStyle: "collapse", fontSize: "5px", fontFamily: "arial", width: UI.PDF.maxWdith.portrait }}>
                <thead>
                    <tr style={styleRow}>
                        <th style={styleCellHeader}>N°</th>
                        <th style={styleCellHeader}>Curso</th>
                        <th style={styleCellHeader}>Tipo</th>
                        <th style={styleCellHeader}>Modulo</th>
                        <th style={styleCellHeader}>Docente</th>
                        <th style={styleCellHeader}>Fecha Inicio</th>
                        <th style={styleCellHeader}>Fecha Fin</th>
                        <th style={styleCellHeader}>Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        register.subRooms.map((subR, index) => (
                            <>
                                <tr key={`PDFTR${index}`} style={styleRow}>
                                    <td style={styleCellBody}>{++index}</td>
                                    <td style={styleCellBody}>{subR.courseName}</td>
                                    <td style={styleCellBody}>{subR.typeCourse}</td>
                                    <td style={styleCellBody}>{subR.moduleName}</td>
                                    <td style={styleCellBody}>{subR.teacherName}</td>
                                    <td style={styleCellBody}>{subR.dateStart }</td>
                                    <td style={styleCellBody}>{subR.dateEnd}</td>
                                    <td style={styleCellBody}>{subR.score}</td>
                                </tr>
                            </>
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}
