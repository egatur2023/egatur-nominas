import API from "@api";
import { Edit, MoreVert } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, Menu, MenuItem, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography } from "@mui/material";
import { CurricularStructure } from "@prisma/client";
import { MouseEvent, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { DtoEditCurricular } from "resources/types";
import DialogBasic from "../dialog.basic";
import EditCurricular from "./edit";
import { useStoreCurricular } from "resources/local/store.curricular";

export default function ListCurricularStructure() {
    const styles: SxProps<Theme> = {
        height: {
            md: "calc(100vh - 64px - 32px - 128px)",
            xs: "calc(128px)",
        },
    }
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const { selectedCareer , selectCurricular } = useStoreCurricular()
    const careerId = selectedCareer?.id || 0
    const [curriculars, setCurriculars] = useState<CurricularStructure[]>([])
    const { isLoading, isFetching } = useQuery<CurricularStructure[]>(
        ["curriculars", careerId],
        async () => API.getCurricularsByCareerId(careerId),
        {
            enabled: selectedCareer ? true : false,
            onSuccess(data) {
                setCurriculars(data)
            }
        }
    )
    const [isOpenEditCurricular, setIsOpenEditCurricular] = useState<boolean>(false)
    const [curricularToEdit, setCurricularToEdit] = useState<DtoEditCurricular>({
        id: 0,
        code: "",
        month: "",
        isRegular: false,
        year: ""
    })

    const handleClickMenu = (e: MouseEvent<HTMLElement>, curricularToEdit: any) => {
        console.log(e.currentTarget)
        e.stopPropagation();
        setCurricularToEdit({ ...curricularToEdit, careerName: curricularToEdit?.career.name });
        setAnchorEl(e.currentTarget);
    }
    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const handleOpenEditCurricular = () => {
        handleCloseMenu()
        setIsOpenEditCurricular(true)
    }

    const handleClickRowCurricular = (curricular: any) => {
        selectCurricular(curricular)
    }

    if (isFetching) {
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
        <DialogBasic isOpen={isOpenEditCurricular} handleOpenDialog={setIsOpenEditCurricular}>
            <EditCurricular fnOnEdit={setIsOpenEditCurricular} curricularToEdit={curricularToEdit} />
        </DialogBasic>
        <TableContainer sx={styles}>
            <Table size="small">
                <TableHead sx={{
                    padding: "0px 0px",
                    backgroundColor: "rgba(85,108,214, 0.5)",
                    fontSize: "1.1rem"
                }}>
                    <TableRow >
                        <TableCell align="left">Código</TableCell>
                        <TableCell align="left">Tipo</TableCell>
                        <TableCell align="left"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {selectedCareer && curriculars && curriculars?.map((curricular) => (
                        <TableRow
                            key={`TRC${curricular.id}${curricular.code}`}
                            onClick={() => handleClickRowCurricular(curricular)}
                            sx={{
                                "&:hover": {
                                    cursor: "pointer",
                                    backgroundColor: t => t.palette.grey[100]
                                }
                            }}
                        >
                            <TableCell align="left">{curricular.code}</TableCell>
                            <TableCell align="left">{curricular.isRegular ? "Regular" : "Irregular"}</TableCell>
                            <TableCell sx={{ pl: 5 }}>
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleClickMenu(e, curricular)}
                                >
                                    <MoreVert fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Menu
            id={`menuCurricularList`}
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
                onClick={handleOpenEditCurricular}>
                <Edit fontSize="small" sx={{ mr: 1 }} />  <Typography>Editar</Typography>
            </MenuItem>
        </Menu>
    </>)
}
