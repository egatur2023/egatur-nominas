import API from "@api";
import { Delete, Home } from "@mui/icons-material";
import { Breadcrumbs, Button, Divider, Grid, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { Course, Module, Room } from 'prisma/prisma-client'
import { useMutation, useQuery , useQueryClient } from '@tanstack/react-query';
import DialogFullScreen from "../dialog.fullscreen";
import { ScheduleType } from "resources/types";
import { useStoreEnrollment } from "resources/local/store.enrollment";


type PropsDialogCreateSubRoom = {
    curricular : { id : number , code : string , registerId : number }
    enrolledSubRooms : any[]
    isOpen : boolean
    handleClose : () => void
}

function PanelModules(){

    const { modules , setCurrentModule } = useStoreEnrollment()
    return (
        <List>
            {
                modules?.map(module => (
                    <ListItemButton key={`LIPM${module.id}${module.name}`} onClick={() => setCurrentModule(module) }>
                        <ListItemText>{module.name}</ListItemText>
                    </ListItemButton>
                ))
            }
        </List>
    )
}
function PanelCourses(){

    const { currentModule , setCurrentCourse } = useStoreEnrollment()
    return (
        <List>
            {
                currentModule?.courses?.map((course : Course) => (
                    <ListItemButton key={`LIPM${course.id}${course.name}`} onClick={() => setCurrentCourse(course) }>
                        <ListItemText>
                            <Typography variant="body2">{course.name}</Typography>
                        </ListItemText>
                    </ListItemButton>
                ))
            }
        </List>
    )
}

function PanelRooms({enrolledSubRooms} : {enrolledSubRooms : any[]}){

    const { currentCourse , currentModule , toEnrollSubModules , enrollRoom } = useStoreEnrollment()
    return (
        <List>
            {
                currentCourse && currentCourse?.rooms?.map((room : Room) => (
                    <ListItem key={`LIPM${room.id}${room.name}`}
                        secondaryAction={
                            <Button
                                variant="outlined"
                                // disabled={enrolledRooms.find(eRoom => eRoom.id === room.id ) ? true : false}
                                disabled={
                                    toEnrollSubModules.find(({ moduleId, toEnrollSubRooms }) =>
                                        (moduleId === currentModule?.id)
                                        && toEnrollSubRooms.find(({courseId}) => courseId === currentCourse.id )
                                    ) || enrolledSubRooms.find(({ courseId }) => courseId === currentCourse.id )  ? true : false
                                }
                                onClick={() => enrollRoom({
                                        courseId : room.courseId,
                                        courseName : currentCourse.name,
                                        roomHour : room.hourStart,
                                        roomSchedule : room.schedule as ScheduleType,
                                        roomName : room.name,
                                        roomId : room.id,
                                        moduleId : currentCourse.moduleId
                                    })
                                }
                                >
                                    Asignar
                            </Button>
                        }
                    >
                        <ListItemText>
                            <Typography variant="body2">{room.name}-{room.hourStart}-{room.schedule}</Typography>
                        </ListItemText>
                    </ListItem>
                ))
            }
        </List>
    )
}



export default function DialogCreateSubRoom({curricular , enrolledSubRooms , handleClose , isOpen} : PropsDialogCreateSubRoom){

    const qc = useQueryClient()
    const mutation = useMutation(API.postSubRoom,{
        onSuccess(){
            qc.invalidateQueries(["api/register/enrollment/byid"])
        }
    })
    const { currentModule , currentCourse , toEnrollSubModules , setPanelName , setModules , unenrollRoom } = useStoreEnrollment()
    const { isLoading } = useQuery<Module[]>(
        ["api/module/bycurricularid"],
        async () => await API.getModulesByCurricularId(curricular?.id),
        {
            onSuccess(data) {
                setModules(data)
            },
        }
    )

    const PanelContent = () => {
        const { panelName } = useStoreEnrollment()
        if(panelName === "panelModules") return <PanelModules />
        if(panelName === "panelModule") return <PanelCourses />
        if(panelName === "panelCourse") return <PanelRooms enrolledSubRooms={enrolledSubRooms} />
        return <></>
    }

    const handleSubmit = () => {
        mutation.mutate({ registerId : curricular.registerId , toEnrollSubModules : toEnrollSubModules })
        handleClose()//close and clear all toEnrollsSub
    }


    if(isLoading){
        return <>Cargando...</>
    }
    return  (

    <DialogFullScreen
                handleClose={handleClose}
                isOpen={isOpen}
                title={curricular?.code || "Curricula"}
                textSave="Matricular"
                handleSave={handleSubmit}
            >

        <Stack spacing={2} m={2}>
            {/* <TextField label="Buscar por nombre" fullWidth/> */}
            <Grid container sx={{ borderRadius: "16px 16px 0px 0px" , border : "1px solid grey"}}>
                <Grid item xs={12}>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ p : 2 , height : "3.5rem"  }}>
                        <Link
                            underline="hover"
                            color="inherit"
                            href="#"
                            onClick={()=> setPanelName("panelModules")}
                        >
                            <Home/>
                        </Link>
                        {
                            currentModule &&
                            <Link
                                fontSize="0.8rem"
                                underline="hover"
                                color="inherit"
                                href="#"
                                onClick={ () => setPanelName("panelModule")}
                            >
                                {currentModule?.name}
                            </Link>
                        }
                        {
                            currentCourse &&
                            <Link
                                fontSize="0.8rem"
                                underline="hover"
                                color="inherit"
                                href="#"
                                onClick={ () => setPanelName("panelCourse")}
                            >
                                {currentCourse?.name}
                            </Link>
                        }
                    </Breadcrumbs>
                    <Divider/>
                </Grid>
                <Grid item xs={6} sx={{ borderRight : "1px solid red" , borderColor : t => t.palette.divider }}>
                    <Stack spacing={2}>
                        <PanelContent />
                    </Stack>
                </Grid>
                <Grid item  xs={6}>
                    <Stack >
                        <Breadcrumbs aria-label="breadcrumb" sx={{ p : 2 , height : "3.5rem" }}>
                            <Typography color="text.primary">AULAS</Typography>
                        </Breadcrumbs>
                        <Divider/>
                        <List>
                            {
                                toEnrollSubModules.map(({ toEnrollSubRooms , moduleId }) => toEnrollSubRooms.map( (toEnrollSubR) =>
                                    <ListItem
                                        key={`LISR${toEnrollSubR.courseName}`}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                onClick={() => unenrollRoom({...toEnrollSubR , moduleId})}
                                            >
                                                <Delete color="error" sx={{ opacity : 0.9 }}/>
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText>
                                            <Typography variant="body2">{toEnrollSubR.courseName} - {toEnrollSubR.roomName}-{toEnrollSubR.roomHour}-{toEnrollSubR.roomSchedule}</Typography>
                                        </ListItemText>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    </DialogFullScreen>
    )

}
