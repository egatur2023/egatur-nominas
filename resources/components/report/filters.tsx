import API from "@api"
import { Autocomplete, CircularProgress, Grid, Stack, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useState } from "react"
import { useQuery } from '@tanstack/react-query'
import {Career, CurricularStructure } from '@prisma/client'
import { DateTime } from "luxon";
import { DtoFilterReport } from "resources/types"



type PropsFilterReport = {
    params : DtoFilterReport
    handleChange : (property : string , value : any) => void
}

export default function FiltersReport({ params , handleChange } : PropsFilterReport ){

    const { data: careers, isLoading: isCareersLoading } = useQuery(["careers"], async () => API.getCareers())
    const [ curriculars , setCurriculars ] = useState<CurricularStructure[]>([])
    useQuery<CurricularStructure[]>(
        ["curriculars", params.careerId],
        async () => API.getCurricularsByCareerId(params.careerId),
        {
            enabled : params.careerId > 0 ? true : false ,
            onSuccess(data) {
                setCurriculars([...data])
            },
        }
    )

    if (isCareersLoading) {
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
        <Grid container spacing={4} >
            <Grid item xs={12} lg={3}>
                <Autocomplete
                    fullWidth
                    options={careers}
                    onChange={(e, career : Career | null) => handleChange("careerId", career?.id)}
                    getOptionLabel={(option : Career| null) => (option?.name as string)}
                    renderInput={(params) => <TextField {...params} label="Carrera" />}
                    />
            </Grid>

            <Grid item xs={12} lg={3}>
                <Autocomplete
                    fullWidth
                    options={curriculars}
                    onChange={ (e, curricular) => handleChange("curricularId", curricular?.id) }
                    getOptionLabel={option => (option.code as string)}
                    renderInput={(params) => <TextField {...params} label="Malla curricular" />}
                    />
            </Grid>
            <Grid item xs={12} lg={2}>
                <TextField
                    fullWidth
                    label="Código admisión"
                    defaultValue={params.admision}
                    onBlur={(e) => handleChange("admision", e.target.value)} />
            </Grid>
            <Grid item xs={12} lg={2}>
                <TextField
                    fullWidth
                    type="date"
                    label="Fecha de Inicio"
                    defaultValue={params.dateStart}
                    onChange={(e) => handleChange("dateStart", e.target.value)} />
            </Grid>
            <Grid item xs={12} lg={2}>
                <TextField
                    fullWidth
                    type="date"
                    label="Fecha Fin"
                    defaultValue={params.dateEnd}
                    onChange={(e) => handleChange("dateEnd", e.target.value)} />
            </Grid>
        </Grid>
    )

}
