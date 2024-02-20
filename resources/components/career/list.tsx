import API from "@api";
import { Edit, MoreVert } from "@mui/icons-material";
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, SxProps, IconButton, Menu, MenuItem, Typography, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { Career } from "@prisma/client";
import { MouseEvent, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { CareerToEdit } from "resources/types";
import DialogBasic from "../dialog.basic";
import EditCareer from "./edit";
import { useStoreCurricular } from "resources/local/store.curricular";
import { useSession } from "next-auth/react";
import { hasPermission } from "resources/functions/helpers.frontend";

export default function ListCareer() {

    const { data } = useSession()
    const styles: SxProps = {
        height: {
            md: "calc(100vh - 64px - 32px - 128px)",
            xs: "calc(128px)",
        },
    }

    const { data: careers, isLoading } = useQuery<Career[]>(["careers"], async () => await API.getCareers(),{
        initialData : []
    })
    const {selectCareer} = useStoreCurricular()
    const [isOpenEditCareer, setIsOpenEditCareer] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [careerToEdit, setCareerToEdit] = useState<CareerToEdit>({
        id: 0,
        name: ""
    })
    const handleClickMenu = (e: MouseEvent<HTMLElement>, careerToEdit: Career) => {
        e.stopPropagation()
        setCareerToEdit(careerToEdit)
        setAnchorEl(e.currentTarget);
    }
    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const handleOpenEditCareer = () => {
        handleCloseMenu()
        setIsOpenEditCareer(true)
    }
    const handleClickRowCareer = (career: any) => {
        selectCareer(career)
    }

    const isAuthorizedToUpdateCareer = hasPermission(data?.user.role.permissions||[],'Malla Curricular.update')

    if (isLoading) {
        return <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"100vh"}
        >
            <CircularProgress></CircularProgress>
        </Box>
    }

    return (<>
        <DialogBasic isOpen={isOpenEditCareer} handleOpenDialog={setIsOpenEditCareer}>
            <EditCareer careerToEdit={careerToEdit} fnOnEdit={setIsOpenEditCareer} />
        </DialogBasic>
        <TableContainer sx={styles}>
            <Table size="small">
                <TableHead sx={{
                    padding: "0px 0px",
                    backgroundColor: "rgba(85,108,214, 0.5)",
                    fontSize: "1.1rem"
                }}>
                    <TableRow>
                        <TableCell sx={{ pl: 5 }}>Nombre</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {careers && careers?.map((career, i) => (
                        <TableRow key={`RI${i}`}
                            onClick={() => handleClickRowCareer(career)}
                            sx={{
                                "&:hover": {
                                    cursor: "pointer",
                                    backgroundColor: t => t.palette.grey[100],
                                },
                            }}>
                            <TableCell sx={{ pl: 5 }}>{career.name}</TableCell>
                            <TableCell sx={{ pl: 5 }}>
                            {
                                isAuthorizedToUpdateCareer &&
                                    <IconButton size="small"
                                        onClick={e => handleClickMenu(e, career)}
                                    >
                                        <MoreVert sx={{ fontSize : 16 }} />
                                    </IconButton>
                            }
                            </TableCell>
                        </TableRow>
                    ))}
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
                onClick={handleOpenEditCareer}>
                <Edit fontSize="small" sx={{ mr: 1 }} />  <Typography>Editar</Typography>
            </MenuItem>
        </Menu>
    </>)
}

