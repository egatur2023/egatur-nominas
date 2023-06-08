import API from "@api";
import { Edit, MoreVert } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Module } from "@prisma/client";
import { MouseEvent, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { DtoEditModule } from "resources/types";
import DialogBasic from "../dialog.basic";
import EditModule from "./edit";
import { useStoreCurricular } from "resources/local/store.curricular";

export default function ListModule() {

    const { selectedCurricular , selectModule } = useStoreCurricular()
    const [modules, setModules] = useState<Module[]>([])
    const curricularId = selectedCurricular?.id || 0
    const { isLoading, isFetching } = useQuery<Module[]>(
        ["modules", curricularId],
        async () => API.getModulesByCurricularId(curricularId),
        {
            enabled: selectedCurricular ? true : false,
            onSuccess(data) {
                setModules(data)
            },
        }
    )
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [isOpenEditModule, setIsOpenEditModule] = useState<boolean>(false)
    const [moduleToEdit, setModuleToEdit] = useState<DtoEditModule>({ id: 0, name: "" })

    const handleClickRowModule = (module: any) => {
        selectModule(module)
    }

    const handleClickMenu = (e: MouseEvent<HTMLElement>, moduleToEdit: DtoEditModule) => {
        e.stopPropagation()
        setAnchorEl(e.currentTarget)
        setModuleToEdit(moduleToEdit)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    const handleOpenEditModule = () => {
        handleCloseMenu()//quitar referencia del menu
        setIsOpenEditModule(true)//abrir modal
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
        <DialogBasic isOpen={isOpenEditModule} handleOpenDialog={setIsOpenEditModule}>
            <EditModule fnOnEdit={setIsOpenEditModule} moduleToEdit={moduleToEdit} />
        </DialogBasic>
        <TableContainer sx={{ height: "calc(100vh - 64px - 32px - 128px)" }}>
            <Table size="small">
                <TableHead sx={{
                    padding: "0px 0px",
                    backgroundColor: "rgba(85,108,214, 0.5)",
                    fontSize: "1.1rem"
                }}>
                    <TableRow>
                        <TableCell align="left">Nombre</TableCell>
                        <TableCell align="left"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        selectedCurricular && modules && modules?.map((module) => (
                            <TableRow
                                key={`TRM${module.id}${module.name}`}
                                onClick={() => handleClickRowModule(module)}
                                sx={{
                                    "&:hover": {
                                        cursor: "pointer",
                                        backgroundColor: t => t.palette.grey[100]
                                    }
                                }}
                            >
                                <TableCell align="left">{module.name}</TableCell>
                                <TableCell sx={{ pl: 5 }}>
                                    <IconButton size="small"
                                        onClick={(e) => handleClickMenu(e, module)}
                                    >
                                        <MoreVert fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
        <Menu
            id={`menuActionsModule`}
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
                onClick={handleOpenEditModule}>
                <Edit fontSize="small" sx={{ mr: 1 }} />  <Typography>Editar</Typography>
            </MenuItem>
        </Menu>
    </>)
}
