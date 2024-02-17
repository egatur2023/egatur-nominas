import jsPDF from "jspdf"
import fs from 'node:fs'
import { NextApiRequest, NextApiResponse } from "next";
import { getSubscriptionsRoomReportByAdmission } from "resources/services/attendance/getSubscriptionsRoomReportByAdmission";
import autoTable from "jspdf-autotable";
import { renderToStaticMarkup } from "react-dom/server";
import {AttendanceReportByAdmission } from "resources/components/attendance/AttendanceReportByAdmission";
import { GroupedResult } from "resources/types";
import PDFDocument from "pdfkit-table"
export default async function handler(req : NextApiRequest, res : NextApiResponse){
    const result : GroupedResult = await getSubscriptionsRoomReportByAdmission(String(req.query.admission as string))

    // Crear un nuevo documento PDF
    const doc = new PDFDocument({size: 'A4'});

    doc.pipe(fs.createWriteStream('SampleDocument.pdf'))
    doc.text(`Reporte de Asistencias por la Admissión - ${req.query.admission}`)

    await Promise.all(Object.keys(result).map(async(studentId, index) => {
        const student = result[studentId]
        doc.text(`${student.studentFullName}`)
        await Promise.all(
            student.courses.map(async (course, index) => {
                await doc.table({
                    title : course.courseName,
                    headers : course.attendances.map(at => at.date.toLocaleString('es-ES',{ year : 'numeric', month:'numeric',day : 'numeric' })),
                    rows : [
                        [ "Switzerland"],
                        [ "Switzerland"],
                        [ "Switzerland"],
                        [ "Switzerland"],
                        [ "Switzerland"],
                    ]
                    // rows: [course.attendances.map(attendance => attendance.date)]

                })
            })
        )
        // doc.addPage()

    }))


    doc.end()
    res.setHeader('Content-Disposition', 'attachment; filename=salida.pdf;charset=utf-8')
    res.setHeader('Content-Type', 'application/pdf')
    doc.pipe(res)



    // res.json(result)
}
