import API from "@api";
import { Add, AddLocationAlt, CompareArrows, Home, Inventory, QrCode2 } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Container, Divider, TableHead, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography, Avatar, Breadcrumbs, Link } from "@mui/material";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
// import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import CreateCareer from "resources/components/career/create";
import ListCareer from "resources/components/career/list";
import CreateCourse from "resources/components/course/create";
import ListCourse from "resources/components/course/list";
import CreateCurricular from "resources/components/curricular/create";
import ListCurricularStructure from "resources/components/curricular/list";
import DialogBasic from "resources/components/dialog.basic";
import CreateModule from "resources/components/module/create";
import ListModule from "resources/components/module/list";
import { useStoreCurricular } from "resources/local/store.curricular";
// import queryClient from "resources/query.client";
// import { authOptions } from "../../api/auth/[...nextauth]"

export default function Career(props : any) {
    const [isOpenCreateCareer, setIsOpenCreateCareer] = useState<boolean>(false)
    const [isOpenCreateCurricular, setIsOpenCreateCurricular] = useState<boolean>(false)
    const [isOpenCreateModule, setIsOpenModule] = useState<boolean>(false)
    const [isOpenCreateCourse, setIsOpenCreateCourse] = useState<boolean>(false)
    const { selectedCareer , selectedCurricular , selectedModule } = useStoreCurricular()


    const handleIsOpenCreateCareer = (isOpen: boolean) => {
        setIsOpenCreateCareer(isOpen)
    }
    const handleOpenCreateCurricular = (isOpen: boolean) => {
        setIsOpenCreateCurricular(isOpen)
    }
    const handleIsOpenCreateModule = (isOpen: boolean) => {
        setIsOpenModule(isOpen)
    }

    const handleIsOpenCreateCourse = (isOpen: boolean) => {
        setIsOpenCreateCourse(isOpen)
    }

    return <Box sx={{ marginTop: 4 }}
        mx={"2rem"}
    >
        {/* MODALS */}
        <DialogBasic isOpen={isOpenCreateCareer} handleOpenDialog={handleIsOpenCreateCareer}>
            <CreateCareer fnOnCreate={handleIsOpenCreateCareer}/>
        </DialogBasic>
        <DialogBasic isOpen={isOpenCreateCurricular} handleOpenDialog={handleOpenCreateCurricular}>
            <CreateCurricular fnOnCreate={handleOpenCreateCurricular}/>
        </DialogBasic>
        <DialogBasic isOpen={isOpenCreateModule} handleOpenDialog={handleIsOpenCreateModule}>
            <CreateModule fnOnCreate={handleIsOpenCreateModule}/>
        </DialogBasic>
        <DialogBasic isOpen={isOpenCreateCourse} handleOpenDialog={handleIsOpenCreateCourse}>
            <CreateCourse fnOnCreate={handleIsOpenCreateCourse}/>
        </DialogBasic>
        {/* END MODALS */}
        <Typography variant="h5" sx={{ fontWeight: "bolder", marginBottom: theme => theme.spacing(2) }}>Gestión</Typography>
        <Card variant="outlined">
            <CardContent sx={{ padding: "0px !important" }}>
                <Grid container>
                    <Grid item xs={12}>
                        <Box sx={{ width: "100%", display: "flex", alignItems: "center", px: 1, py: 2, backgroundColor: t => t.palette.grey[50] }}>
                            <Home fontSize="small" sx={{ mr : 2 }} />
                            <Breadcrumbs aria-label="breadcrumb" separator="›">
                                {
                                    selectedCareer &&
                                    <Link underline="hover" color="inherit" href="/">
                                        <Typography color="text.primary" variant="body2">{selectedCareer?.name}</Typography>
                                    </Link>
                                }
                                {
                                    selectedCurricular &&
                                    <Link underline="hover" color="inherit" href="/">
                                        <Typography color="text.primary" variant="body2">{selectedCurricular?.code}</Typography>
                                    </Link>
                                }
                                {
                                    selectedModule &&
                                    <Link underline="hover" color="inherit" href="/">
                                        <Typography color="text.primary" variant="body2">{selectedModule?.name}</Typography>
                                    </Link>
                                }
                                <Typography color="text.primary" variant="body2">Curso</Typography>
                            </Breadcrumbs>
                        </Box>
                        <Divider />
                    </Grid>
                    {/* COLUMN CARRERA 1 */}
                    <Grid item xs={12} md={3} lg={3} >
                        <Box sx={{ width : "100%" , display : "flex" , alignItems : "center" , p : 1 , bgcolor : t => t.palette.grey[50] }}>
                            <Inventory fontSize="small" sx={{ mr : 2 }}/>
                            <Typography variant="body2">Carreras</Typography>
                        </Box>
                        <Divider/>
                        <Button
                        variant="text"
                        fullWidth
                        onClick={() => handleIsOpenCreateCareer(true)}
                        sx={{ display : "flex" , justifyContent : "flex-start", textTransform : "capitalize"  , paddingY:t=>t.spacing(1) }}
                        >
                            <Add sx={{ marginRight : t => t.spacing(1) }}/>
                            <Typography variant="body2" >Crear Carrera</Typography>
                        </Button>
                        <Divider />
                        <ListCareer />
                    </Grid>
                    {/* COLUMN MALLA 2 */}
                    <Grid item xs={12} md={3} lg={3} sx={{ borderLeft: "1px solid", borderColor: t => t.palette.divider }}>
                        <Box sx={{ width: "100%", display: "flex", alignItems: "center", p : 1, backgroundColor: t => t.palette.grey[50] }}>
                            <QrCode2 fontSize="small" sx={{ mr : 2 }} />
                            <Typography variant="body2">Mallas Curriculares</Typography>
                        </Box>
                        <Divider />
                        {<>
                            <Button
                                variant="text"
                                fullWidth
                                disabled={selectedCareer ? false : true}
                                onClick={() => handleOpenCreateCurricular(true)}
                                sx={{ display: "flex", justifyContent: "flex-start", textTransform: "capitalize", py : 1 }}
                            >
                                <Add sx={{ mr : 1 }} />
                                <Typography variant="body2">Crear malla curricular</Typography>
                            </Button>
                            <Divider />
                            <ListCurricularStructure />
                        </>}
                    </Grid>
                    {/* COLUMN MODULO 3 */}
                    <Grid item xs={12} md={2} lg={2} sx={{ borderLeft: "1px solid", borderColor: t => t.palette.divider }}>
                        <Box sx={{ width: "100%", display: "flex", alignItems: "center", p : 1, backgroundColor: t => t.palette.grey[50] }}>
                            <CompareArrows fontSize="small" sx={{ mr : 2 }} />
                            <Typography variant="body2">Modulos</Typography>
                        </Box>
                        <Divider />
                        <Button
                            variant="text"
                            fullWidth
                            disabled={selectedCurricular ? false : true}
                            onClick={() => handleIsOpenCreateModule(true)}
                            sx={{ display: "flex", justifyContent: "flex-start", textTransform: "capitalize", py : 1 }}
                        >
                            <Add sx={{ mr : 1 }} />
                            <Typography variant="body2">Crear Modulo</Typography>
                        </Button>
                        <Divider />
                        <ListModule />
                    </Grid>

                    {/* COLUMN CURSOS 4 */}
                    <Grid item xs={12} md={4} lg={4} sx={{ borderLeft: "1px solid", borderColor: t => t.palette.divider }}>
                        <Box sx={{ width: "100%", display: "flex", alignItems: "center", p : 1, backgroundColor: t => t.palette.grey[50] }}>
                            <CompareArrows fontSize="small" sx={{ mr : 2 }} />
                            <Typography variant="body2">Cursos</Typography>
                        </Box>
                        <Divider />
                        {<>
                            <Button
                                variant="text"
                                fullWidth
                                disabled={selectedModule ? false : true}
                                onClick={() => handleIsOpenCreateCourse(true)}
                                sx={{ display: "flex", justifyContent: "flex-start", textTransform: "capitalize", py : 1 }}
                            >
                                <Add sx={{ mr : 1 }} />
                                <Typography variant="body2">Crear Curso</Typography>
                            </Button>
                            <Divider />
                            <ListCourse />
                        </>}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </Box>
}

// export async function getServerSideProps(context : GetServerSidePropsContext) {

//     const queryClient = new QueryClient()
//     await queryClient.prefetchQuery(['careers'], async () => await API.getCareers())
//     return {
//         props: {
//             dehydratedState: dehydrate(queryClient),
//             // session: await unstable_getServerSession(
//             //     context.req,
//             //     context.res,
//             //     authOptions
//             //   ),
//         }, // will be passed to the page component as props
//     }
// }
