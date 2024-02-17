import API from "@api";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Breadcrumbs, Card, CardContent, Chip, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { Career, CurricularStructure } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import DataTable from "resources/components/data.table";
import { useStoreAdmissionListFilter } from "resources/local/store.admission.list.filter";
import { ResultGetAdmissionsByAdmission } from "resources/types";

export default function AdmissionPage(){

    const router = useRouter()
    const { setFilterAdmission , careerName , month , year , schedule } = useStoreAdmissionListFilter()
    const { data: careers, isLoading: isCareersLoading } = useQuery(["careers"], async () => API.getCareers(),{
        initialData : []
    })

    const years = useMemo(() => Array.from({ length: 10 }, (_,i) => new Date().getFullYear() - i),[])
    const months = useMemo(() => Array.from({ length: 12 }, (_,nm) => new Date(2000,nm,1).toLocaleDateString('es-ES', { month: 'long' }).toUpperCase()),[])
    const schedules = useMemo(() => ["Mañana","Tarde","Noche","Todos"],[])

    const [groupAdmissions, setGroupAdmissions] = useState<Record<string,ResultGetAdmissionsByAdmission>>({})


    const { data : admissions } = useQuery<ResultGetAdmissionsByAdmission>({
        queryKey : ["admissions",careerName,month,year,schedule],
        queryFn : async () => API.postFilterAdmissions({careerName,month,year,schedule}),
        enabled : careerName.length > 0 ,
        initialData : [],
        onSuccess(data) {
            setGroupAdmissions(data.reduce((acc, current) => {
                // let year = parseInt(current.name.split("-")[2].trim())
                let year = new Date(current.dateStart).getFullYear()
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
                <Grid item xs={12} lg={3}>
                    <Autocomplete
                        fullWidth
                        options={careers}
                        onChange={(e, career : Career | null) => {
                            setFilterAdmission("careerName", String(career?.name))
                            // setCa("careerName", String(career?.name))
                        }}
                        getOptionLabel={(option : Career| null) => (option?.name as string)}
                        renderInput={(params) => <TextField {...params} label="Carrera" />}
                        />
                </Grid>

                <Grid item xs={12} lg={3}>
                        <FormControl fullWidth>
                            <InputLabel id="year">Año</InputLabel>
                            <Select id="year" name="year" value={String(year)} onChange={(e) => setFilterAdmission( "year" , String(e.target.value) )}>
                                {

                                    years.map((year , index) => ( <MenuItem key={`year${year}`} value={year}>{year}</MenuItem>))
                                }
                            </Select>
                        </FormControl>
                </Grid>
                <Grid item xs={12} lg={3}>
                    <FormControl fullWidth>
                        <InputLabel id="month">Mes</InputLabel>
                        <Select id="month" name="month" value={month} onChange={ (e) => setFilterAdmission("month" , String(e.target.value))}>
                            <MenuItem value={""}>Todos</MenuItem>
                            {

                                months.map((_month,index) => ( <MenuItem key={`_month${_month}`} value={_month}>{_month}</MenuItem>))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} lg={3}>
                    <FormControl fullWidth>
                        <InputLabel id="schedule">Turno</InputLabel>
                        <Select id="schedule" name="schedule" value={schedule}  onChange={ (e) => setFilterAdmission("schedule" , String(e.target.value))}>
                            {/* <MenuItem value={""}>Todos</MenuItem> */}
                            {
                                schedules.map((_schedule) => ( <MenuItem key={`_schedule${_schedule}`} value={_schedule}>{_schedule}</MenuItem>))
                            }
                        </Select>
                    </FormControl>
                </Grid>


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
                                    groupAdmissions[groupYear].map( (row,i) => (
                                        <Chip key={`AD${i}`} label={`${row.admision} (${row.curricular.code})`} onClick={() => handleClickRoom(row.admision)} />
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
