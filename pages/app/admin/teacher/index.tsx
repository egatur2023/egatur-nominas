import API from "@api";
import { Delete, DriveFileRenameOutline, Edit, Topic } from "@mui/icons-material";
import { Box, Button, CircularProgress, Fade, IconButton, Tooltip, Typography } from "@mui/material";
import { Teacher } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import DataTable from "resources/components/data.table";

import DialogCreateTeacher from "resources/components/teacher/dialog.create";
import DialogEditTeacher from "resources/components/teacher/dialog.edit.teacher";
import { hasPermission } from "resources/functions/helpers.frontend";
import { useStoreTeacher } from "resources/local/store.teacher";
import { DtoEditTeacher, TeacherToEdit } from "resources/types";



export default function Index() {

    const { data: teachers, isLoading } = useQuery<Teacher[]>(["teachers"], async () => API.getTeachers(), {
        initialData: []
    })

    const { data }= useSession()

    const { setIsOpenDialogCreate , setIsOpenDialogEdit  } = useStoreTeacher()
    const [teacherToEdit, setTeacherToEdit] = useState<TeacherToEdit>({
        id: 0,
        dni: "",
        fullName: "",
        telephone: ""
    })

    const handleEditTeacher = (teacherToEdit: DtoEditTeacher) => {
        setTeacherToEdit(teacherToEdit)
        setIsOpenDialogEdit(true);
    }

    const isAuthorizedForUpdateTeacher = hasPermission(data?.user?.role.permissions || [], 'Docentes.update')
    const isAuthorizedForCreateTeacher = hasPermission(data?.user?.role.permissions || [], 'Docentes.create')
    const columnHelper = createColumnHelper<Teacher>()
    //@ts-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns: ColumnDef<Teacher>[] = useMemo(() => [
        columnHelper.accessor((_, index) => ++index, {
            header: "N°"
        }),
        columnHelper.accessor("dni", {
            header: "DNI"
        }),
        columnHelper.accessor("fullName", {
            header: "Apellidos y Nombres"
        }),
        columnHelper.accessor("telephone", {
            header: "Celular"
        }),

        columnHelper.accessor(() => 0, {
            id: "Actions",
            header: "Acciones",
            enableGlobalFilter: false,
            cell(props) {
                return (
                    <Box>
                        {
                            isAuthorizedForUpdateTeacher &&
                            <Tooltip
                                title="Editar"
                                placement="top"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 400 }}
                                arrow>
                                <IconButton size="small" onClick={() => { handleEditTeacher(props.row.original)}}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>

                            </Tooltip>
                        }
                    </Box>
                )
            },
        }),
    ], [isAuthorizedForUpdateTeacher])

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


    return (
        <>
            <DialogCreateTeacher />
            <DialogEditTeacher teacherToEdit={teacherToEdit} />

            <Box
                marginTop={"2rem"}
                marginX={"2rem"}
            >

                <Box
                    marginBottom={"2rem"}
                    display={"flex"}
                    justifyContent={"space-between"}
                >
                    <Typography
                        variant="h5"
                        fontWeight={"bold"}
                    >
                        Registros de Docentes
                    </Typography>

                    {
                        isAuthorizedForCreateTeacher &&
                        <Button
                            variant="contained"
                            onClick={() => setIsOpenDialogCreate(true)}
                        >
                            Agregar Docente
                        </Button>
                    }
                </Box>

                <DataTable
                    //@ts-ignore
                    columns={columns}
                    data={teachers}
                />
            </Box>
        </>

    )
}
