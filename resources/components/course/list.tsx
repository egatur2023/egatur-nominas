import API from '@api';
import { ApartmentRounded, Edit, MoreVert } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Menu, MenuItem, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import { MouseEvent, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CoursesByModuleId1, DtoEditCourse } from 'resources/types';
import DialogBasic from '../dialog.basic';
import EditCourse from './edit';
import { useStoreCurricular } from 'resources/local/store.curricular';
import { hasPermission } from 'resources/functions/helpers.frontend';
import { useSession } from 'next-auth/react';
export default function ListCourse() {
    const styles: SxProps<Theme> = {
        height: {
            md: "calc(100vh - 64px - 32px - 128px)",
            xs: "calc(128px)",
        },
    }
    const { data } = useSession()
    const { selectedModule, selectedCurricular, selectedCareer } = useStoreCurricular()
    const router = useRouter()
    const moduleId = selectedModule?.id || 0
    const { data: courses, isLoading, isFetching } = useQuery<CoursesByModuleId1>(["courses", moduleId], async () => API.getCourses(moduleId), {
        enabled: selectedModule ? true : false ,
        initialData : []
    })
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isOpenEditCourse, setIsOpenEditCourse] = useState<boolean>(false)
    const [courseToEdit, setCourseToEdit] = useState<DtoEditCourse>({
        id: 0,
        name: "",
        dateEnd: DateTime.now().toISO(),
        dateStart: DateTime.now().toISO(),
        sessions: 0,
        schedule: "MAÑANA",
        type: 'TEORICO',
        careerName: "",
        curricularCode: "",
        moduleName: ""
    })

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const isAuthorizedToUpdateCareer = hasPermission(data?.user.role.permissions||[],'Malla Curricular.update')

    // type CourseWithMod = Course & { module : Module}

    const handleClickMenu = (e: MouseEvent<HTMLElement>, courseToEdit: any  ) => {
        e.stopPropagation()

        setCourseToEdit({
            ...courseToEdit,
            careerName: selectedCareer?.name || "",
            curricularCode: selectedCurricular?.code || "",
            moduleName: selectedModule?.name || ""
        })
        setAnchorEl(e.currentTarget);
    }

    const handleOpenEditCourse = () => {
        handleCloseMenu()
        setIsOpenEditCourse(true)
    }

    const handleGoToRoomsByCourseId = () => {
        router.push({
            pathname : `/app/admin/room/bycourseid/${courseToEdit.id}`,
            query : {
                careerName : String(selectedCareer?.name),
                moduleName : String(selectedModule?.name),
                courseName : courseToEdit?.name,
            }
        })
    }

    if (isFetching) {
        return <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <CircularProgress></CircularProgress>
        </Box>
    }

    return (<>
        <DialogBasic isOpen={isOpenEditCourse} handleOpenDialog={setIsOpenEditCourse}>
            <EditCourse courseToEdit={courseToEdit} fnOnEdit={setIsOpenEditCourse} />
        </DialogBasic>
        <TableContainer sx={styles}>
            <Table size="small">
                <TableHead sx={{
                    padding: "0px 0px",
                    backgroundColor: "rgba(85,108,214, 0.5)",
                    fontSize: "1.1rem"
                }}>
                    <TableRow>
                        <TableCell align="left">Nombre</TableCell>
                        <TableCell align="left">Tipo</TableCell>
                        <TableCell align="left">Sesiones</TableCell>
                        <TableCell align="left"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        selectedModule && courses && courses?.map((course) => (
                            <TableRow
                                key={`TRCO${course.id}${course.name}`}
                                sx={{
                                    "&:hover": {
                                        cursor: "pointer",
                                        backgroundColor: t => t.palette.grey[100]
                                    }
                                }}
                            >
                                <TableCell align="left">{course.name}</TableCell>
                                <TableCell align="left">{course.type}</TableCell>
                                <TableCell align="left">{course.sessions}</TableCell>
                                <TableCell align="left">
                                    {
                                        isAuthorizedToUpdateCareer &&
                                        <IconButton size="small"
                                            onClick={e => handleClickMenu(e, course)}
                                        >
                                            <MoreVert sx={{ fontSize : 16 }} />
                                        </IconButton>
                                    }
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
        <Menu
            id={`menuActionsCareer`}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
        >
            <MenuItem
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center"
                }}
                onClick={handleOpenEditCourse}>
                <Edit fontSize="small" sx={{ mr: 1 }} />  <Typography>Editar</Typography>
            </MenuItem>
            <MenuItem
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center"
                }}
                onClick={() => handleGoToRoomsByCourseId()}>
                <ApartmentRounded fontSize="small" sx={{ mr: 1 }} />  <Typography>Admisiones</Typography>
            </MenuItem>
        </Menu>
    </>)
}
