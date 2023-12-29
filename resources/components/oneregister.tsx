import { CircularProgress, Divider, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Toolbar, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "@api";
import { DtoResRegisterSubRoom, DtoResRegisterWithSubRooms } from "resources/types";
import { Column, ColumnDef, createColumnHelper, FilterFn, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, RowData, SortingFn, sortingFns, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { RankingInfo,rankItem} from '@tanstack/match-sorter-utils'
import { Check, Close, Edit, FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage, PanoramaFishEye, RemoveRedEye } from "@mui/icons-material";
import * as yup from 'yup'
import { useRouter } from "next/router";
import DataTable from "./data.table";


export default function OneRegister({register} : {register : DtoResRegisterWithSubRooms | undefined }) {

    const router = useRouter()
    const subRoomId = parseInt(String(router.query.subroomid)) || 0
    const qc = useQueryClient()
    const [isFocusName , setIsFocusName] = useState<boolean>(false)
    const [courseEdit, setCourseEdit] = useState<DtoResRegisterSubRoom|null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const mutation = useMutation(API.putSubRoomNameAndScore, {
        onSuccess: (updatedCourseName) => {
            setIsSubmitting(false)
            setCourseEdit(null)
            qc.invalidateQueries(["api/register/byid",register?.id])
        },
        onError: (error) => {
            setIsSubmitting(false)
            console.log(error)
        }
    })

    const handleSubmit = () => {
        const schema = yup.object().shape({
            id : yup.number().required(),
            courseName : yup.string().required(),
            score : yup.number().integer().min(0).max(20)
        })
        let _subRoomEdit = { id : courseEdit?.subRoomId || 0 , courseName : courseEdit?.courseName || "", score : courseEdit?.score || 0}
        let validatedSubRoom = schema.isValidSync(_subRoomEdit)
        if(validatedSubRoom){
            mutation.mutate(_subRoomEdit)
            setIsSubmitting(true)
        }
    }

    const columnHelper = createColumnHelper<DtoResRegisterSubRoom>()
    const columns : ColumnDef<DtoResRegisterSubRoom,any>[] = useMemo(()=>
        [
            columnHelper.accessor((row,index) => ++index,{
                header :"N°",
                enableGlobalFilter : false,
            }),
            columnHelper.accessor("courseName",{
                id : "courseName",
                header :"Curso",
                enableGlobalFilter : true,
                cell(props) {
                    return  courseEdit && courseEdit?.subRoomId === props.row.original.subRoomId ?
                    <TextField
                        autoFocus={isFocusName}
                        fullWidth
                        size="small"
                        variant="outlined"
                        onClick={(e) => setIsFocusName(true)}
                        value={courseEdit?.courseName}
                        onChange={(e) => setCourseEdit({...courseEdit , courseName : String(e.target.value) || ""})}
                    />
                    : props.getValue()
                },
            }),
            columnHelper.accessor("typeCourse",{
                header :"Tipo",
                enableGlobalFilter : true,
            }),
            columnHelper.accessor("moduleName",{
                header :"Module",
                enableGlobalFilter : true,
                // sortingFn : fuzzySort,
            }),
            columnHelper.accessor("teacherName",{
                header :"Docente",
                enableGlobalFilter : true,
            }),
            columnHelper.accessor("dateStart",{
                header :"Fecha Inicio",
                enableGlobalFilter : true,
            }),
            columnHelper.accessor("dateEnd",{
                header :"Fecha Fin",
                enableGlobalFilter : true,
            }),
            columnHelper.accessor("score",{
                header :"Nota",
                enableColumnFilter : true,
                enableGlobalFilter : true,
                cell(props) {
                    return courseEdit && courseEdit?.subRoomId == props.row.original.subRoomId ? (
                        <TextField
                                autoFocus={!isFocusName}
                                fullWidth
                                variant="outlined"
                                type="text"
                                size="small"
                                value={courseEdit?.score}
                                onClick={(e) => setIsFocusName(false)}
                                onChange={(e) => setCourseEdit({...courseEdit , score : parseInt(e.target.value) || 0})}
                            />
                        ):
                        props.getValue()

                },
            }),
            columnHelper.accessor(() => null,{
                id : "Edit",
                header :"Editar Nota",
                enableColumnFilter : false,
                enableGlobalFilter : false,
                cell(props) {
                    return courseEdit && courseEdit?.subRoomId == props.row.original.subRoomId ? (
                        <>
                        <IconButton onClick={()=> handleSubmit()}>
                            {
                                isSubmitting ?(
                                    <CircularProgress size={20} />
                                ) : (
                                    <Check/>
                                )

                            }
                        </IconButton>
                        <IconButton onClick={()=> setCourseEdit(null)}>
                            <Close/>
                        </IconButton>
                        </>
                    ):
                    (
                        <IconButton
                            size="small"
                            color={subRoomId == props.row.original.subRoomId ? "success" : "default"}
                            onClick={()=> {
                            setCourseEdit(props.row.original)
                        }}>
                            <Edit fontSize="small"/>
                        </IconButton>
                    )
                },
            }),
            columnHelper.accessor(() => null,{
                id : "assistance",
                header :"Asistencia",
                enableColumnFilter : false,
                enableGlobalFilter : false,
                cell(props) {
                    return (
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={()=> {
                                router.push(`/app/admin/register/${register?.id}/attendance/${props.row.original.subRoomId}`)
                        }}>
                            <RemoveRedEye fontSize="small"/>
                        </IconButton>
                    )
                },
            })
        ],
        [courseEdit , isSubmitting]
    )

    return (
        <DataTable
            //@ts-ignore
            columns={columns}
            data={register?.subRooms || []}
        />
    )
}
