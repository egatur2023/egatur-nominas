import API from "@api"
import { Autocomplete, Card, CardContent, Grid, TextField } from "@mui/material"
import { Career } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useStoreReport } from "resources/local/store.attendance"


export default function FilterAttendance() {

    const {careerId, dateStart, dateEnd, setFilters} = useStoreReport()
    
    const { data: careers, isLoading: isCareersLoading } = useQuery<Career[]>(["careers"], async () => API.getCareers(), {
        initialData : []
    })
    

    return (
        <>
           <Grid container spacing={4} >
            <Grid item xs={12} lg={3}>
                <Autocomplete
                    fullWidth
                    options={careers}
                    onChange={(e, career : Career | null) => {
                        setFilters( "careerId" , career?.id)
                        console.log(career?.id);
                        }
                    }
                    getOptionLabel={(option : Career| null) => (option?.name as string)}
                    renderInput={(params) => <TextField {...params} label="Carrera" />}
                    />
            </Grid>
        </Grid>
        </>
    )
}