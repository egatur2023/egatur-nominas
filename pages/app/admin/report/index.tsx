import API from "@api";
import { Autocomplete, Box, Card, CardContent, CircularProgress, Divider, Fab, Stack, TextField, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import FiltersReport from "resources/components/report/filters";
import ReportData from "resources/components/report/report.data";
import { DtoFilterReport } from "resources/types";
import { PictureAsPdf } from "@mui/icons-material"
import jsPDF from "jspdf";
import { renderToStaticMarkup } from "react-dom/server";
import TemplateReport1 from "resources/components/pdf/template.report1";
import { useStoreReport } from "resources/local/store.report";

export default function ReportFilter() {

    const filePDF = useMemo(() => (
        new jsPDF({
            format: "a4",
            unit: "px",
            orientation: "landscape",
        })
    ),[])
    const { dataReport1 } = useStoreReport()

    let date = new Date()
    const [params , setParams ] = useState<DtoFilterReport>({
        careerId : 0,
        curricularId : 0,
        admision : "",
        dateStart : DateTime.local(date.getFullYear(), date.getMonth()+1, 1).toUTC().toISODate(),
        dateEnd : DateTime.now().toUTC().toISODate(),
    })

    const handleChangeParams = (property : string ,value : any) => {
        setParams({...params,[property] : value})
    }

    const handleDownloadReportPDF = () => {
        filePDF.setFontSize(1)
        filePDF.html(renderToStaticMarkup(<TemplateReport1 subRooms={dataReport1}/>),{
            margin:  [20,20,20,20] ,
            callback : () => {
                filePDF.save("reporte_general.pdf")
            }
        })
    }
    return (
        <>
        <Card sx={{ my : 4 , boxShadow : 1 }}>
            <CardContent>
                <Stack spacing={3}>
                    <FiltersReport params={params} handleChange={handleChangeParams}/>
                    <ReportData params={params}/>
                </Stack>
            </CardContent>
        </Card>
        <Fab sx={{ position : "fixed" , right : 0 , bottom : 0 , mr : 2 , mb : 2 }} color="primary" aria-label="add"
            onClick={handleDownloadReportPDF}
        >
            <PictureAsPdf />
        </Fab>
        </>
    )
}
