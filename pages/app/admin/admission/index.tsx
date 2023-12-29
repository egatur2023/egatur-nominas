import API from "@api";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Breadcrumbs, Card, CardContent, Chip, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { Career, CurricularStructure } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import DataTable from "resources/components/data.table";
import { useStoreAdmissionListFilter } from "resources/local/store.admission.list.filter";
import { ResultGetRoomsByCareer } from "resources/types";

export default function AdmissionPage(){

    const router = useRouter()
    const { setParam , careerId ,admision , dateStart , dateEnd , isLoading } = useStoreAdmissionListFilter()
    const { data: careers, isLoading: isCareersLoading } = useQuery(["careersx"], async () => API.getCareers(),{
        initialData : []
    })

    const [groupAdmissions, setGroupAdmissions] = useState<Record<string,ResultGetRoomsByCareer>>({})
    // const{ data : curriculars } = useQuery<CurricularStructure[]>(
    //     ["curricularsx", careerId],
    //     async () => API.getCurricularsByCareerId(careerId),
    //     {
    //         enabled : careerId > 0 ? true : false,
    //         initialData : []
    //     }
    // )

    const { data : admissions } = useQuery<ResultGetRoomsByCareer>(["admissions", careerId, dateStart, dateEnd], async () => API.postFilterAdmissions({careerId,admision, dateStart, dateEnd}), {
        enabled : careerId > 0 ? true : false,
        initialData : [],
        onSuccess(data) {
            setGroupAdmissions(data.reduce((acc, current) => {
                let year = parseInt(current.name.split("-")[2].trim())
                acc[year] = acc[year] || [];
                acc[year].push(current);
                return acc
            }, Object.create(null)))
        },
    })

    const handleClickRoom = (roomId : number) => {
        router.push(`/app/admin/admission/${roomId}`)
    }

    // console.log({careerId ,admision, dateStart , dateEnd})
    return (<>
        <Breadcrumbs aria-label="breadcrumb">
            <Typography color="text.primary">Admisiones</Typography>
            <Typography color="text.secondary">Buscar</Typography>
        </Breadcrumbs>

        <Stack marginTop={4} gap={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={4}>
                    <Autocomplete
                        fullWidth
                        options={careers}
                        onChange={(e, career : Career | null) => setParam("careerId", career?.id)}
                        getOptionLabel={(option : Career| null) => (option?.name as string)}
                        renderInput={(params) => <TextField {...params} label="Carrera" />}
                        />
                </Grid>
                    {/* <Grid item xs={12} lg={3}>
                    <Autocomplete
                        fullWidth
                        options={curriculars}
                        onChange={ (e, curricular) => setParam("curricularId", curricular?.id) }
                        getOptionLabel={option => (option.code as string)}
                        renderInput={(params) => <TextField {...params} label="Malla curricular(Admisiones)" />}
                        />
                </Grid> */}
                <Grid item xs={12} lg={4}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Fecha de Inicio"
                        defaultValue={dateStart}
                        onChange={(e) => setParam("dateStart", e.target.value)} />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Fecha Fin"
                        defaultValue={dateEnd}
                        onChange={(e) => setParam("dateEnd", e.target.value)} />
                </Grid>
                {/* <Grid item xs={12} lg={2}>
                    <LoadingButton loading={isLoading} >Buscar</LoadingButton>
                </Grid> */}

            </Grid>
            {
                <Card variant="outlined">
                    <CardContent sx={{ bgcolor : admissions.length > 0 ? "white" : "#ffeebb" , p : 0 }}>
                       {
                        admissions.length > 0 ?
                        Object.keys(groupAdmissions).map( (groupYear, i) => (
                            <>
                            <Divider key={`divider${groupYear}${i}`}/>
                            <Card key={`gpyear${groupYear}${i}`} variant="outlined" sx={{ border:0  }}>
                                <CardContent sx={{ m : 0 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {groupYear}
                                </Typography>
                                <Stack direction="row" gap={2} flexWrap="wrap">
                                {
                                    groupAdmissions[groupYear].map( (row) => (
                                        <Chip key={`AD${row.courseId}${row.name}`} label={row.name} onClick={() => handleClickRoom(row.id)} />
                                    ))
                                }
                                </Stack>
                                </CardContent>
                            </Card>
                            </>
                        ))
                        :
                        <Typography variant="h6" color="#b26500" textAlign="center">No hay datos</Typography>
                       }
                    </CardContent>
                </Card>
            }

        </Stack>
    </>)
}
