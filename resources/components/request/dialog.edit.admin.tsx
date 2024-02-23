import API, { instanceAxios } from "@api";
import { Download } from "@mui/icons-material";
import { Alert, AlertTitle, Button, DialogActions, DialogContent, DialogTitle, Fab, FormControl, FormControlLabel, FormHelperText, FormLabel, IconButton, List, ListItem, ListItemAvatar, ListItemText, Radio, RadioGroup, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { StateUpdate } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import React, { useMemo, useState } from "react";
import { useStoreRequest } from "resources/local/store.request";
import { DocumentRequest, DtoEditRequestAdmin } from "resources/types";
import { schemaEditRequestAdmin } from "resources/validation/schema.edit.request.admin";
import DialogBasic from "../dialog.basic";

type DocumentsRequestUploaded = {
    doc1 : DocumentRequest & { id : string}
    doc2 : DocumentRequest & { id : string}
    doc3 : DocumentRequest & { id : string}
}

export default function DialogEditRequestAdmin(){
    const qc = useQueryClient()
    const [isSending, setIsSending] = useState(false)
    const statesUpdateRequest : StateUpdate[] =  ["ACEPTADO","RECHAZADO","OBSERVADO"]
    const { isOpenDialogEdit , setIsOpenDialogEdit , requestToEdit , setRequestToEdit  } = useStoreRequest()
    const initial = {
        doc1 : { name : "" , id : "" , extension : ""} ,
        doc2 : { name : "" , id : "" , extension : ""},
        doc3 : { name : "" , id : "" , extension : ""},
    }
    const documents = (requestToEdit?.documents ? JSON.parse(String(requestToEdit?.documents)) : initial) as DocumentsRequestUploaded
    const [message , setMessage] = useState<string>("")
    const mutation = useMutation(API.putRequestAdmin,{
        onSuccess(data, variables, context) {
            qc.invalidateQueries(["api/request/admin"])
            setIsSending(false)
            resetForm()
            setIsOpenDialogEdit(false)
            setRequestToEdit(null)
            console.log(requestToEdit)
        },
        onError(error : any, variables, context) {
            setIsSending(false)
            if(axios.isAxiosError(error) && error){
                const err : any = error as AxiosError
                setMessage(String(err?.response?.data?.message))
            }else{
                setMessage("500")
                console.error("DESCONOCIDO",error)
            }
        },
    })

    const {
        values: request ,
        handleChange ,
        handleSubmit ,
        errors ,
        touched ,
        resetForm  } = useFormik<DtoEditRequestAdmin>({
        validationSchema : schemaEditRequestAdmin,
        initialValues : {
            requestId : requestToEdit?.requestId || 0,
            observation : requestToEdit?.observation || "",
            stateUpdate : requestToEdit?.stateUpdate || "PENDIENTE"

        },
        enableReinitialize : requestToEdit != null,
        async onSubmit(validatedRequest) {
            setIsSending(true)
            mutation.mutate(validatedRequest)
        },
    })

    const handleDownload = async (fileId : string , extension : string,fileName : string) => {
        if(fileId){
            const isDownloaded = await API.downloadDocumentById(fileId,extension,fileName)
        }
    }

    return (
        <DialogBasic isOpen={isOpenDialogEdit} handleOpenDialog={(isOpen) => {
            resetForm()
            setMessage("")
            setIsOpenDialogEdit(isOpen)
        }}>
            <DialogTitle>
                <Typography>Responder solicitud</Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
                    <Stack spacing={2}>

                        <Box sx={{ display : "flex" }}>
                            <Typography variant="body2" color="GrayText" marginRight={1}>Motivo: </Typography>
                            <Typography variant="body2"> {requestToEdit?.reason}</Typography>
                        </Box>

                        <TextField
                            name="observation"
                            label="Observación"
                            variant="outlined"
                            onChange={handleChange} multiline rows={3}
                            helperText={ touched.observation && errors.observation}
                            defaultValue={requestToEdit?.observation}
                            error={touched.observation && Boolean(errors.observation)}
                        />

                        <FormControl error={ touched.stateUpdate && Boolean(errors.stateUpdate)}>
                            <FormLabel>Estado de solicitud</FormLabel>
                            <RadioGroup
                            row
                            name="stateUpdate"
                            onChange={handleChange}
                            >
                            {
                                statesUpdateRequest.map( value =>
                                    <FormControlLabel key={value}
                                    label={<Typography variant="body2">{`${value.charAt(0)}${value.slice(1).toLowerCase()}`}</Typography>}
                                    value={value}
                                    checked={request.stateUpdate == value}
                                    control={<Radio size="small" />}
                                    />
                                )
                            }
                            </RadioGroup>
                            <FormHelperText>{errors.stateUpdate}</FormHelperText>
                        </FormControl>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>N°</TableCell>
                                        <TableCell>Archivo</TableCell>
                                        <TableCell>Descargar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                            <TableCell>1</TableCell>
                                            <TableCell>{documents.doc1.name}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="secondary"
                                                    disabled={!Boolean(documents.doc1.name)}
                                                    onClick={e => handleDownload(documents.doc1.id,documents.doc1.extension.toLocaleLowerCase(),documents.doc1.name)}
                                                >
                                                    <Download/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    <TableRow>
                                        <TableCell>2</TableCell>
                                        <TableCell>{documents.doc2.name}</TableCell>
                                        <TableCell>
                                            {
                                                documents.doc2.name != "" && documents.doc2.id.length > 0 &&
                                                <IconButton
                                                    color="secondary"
                                                    disabled={!Boolean(documents.doc2.name)}
                                                    onClick={e => handleDownload(documents.doc2.id,documents.doc2.extension.toLocaleLowerCase(),documents.doc2.name)}
                                                >
                                                    <Download/>
                                                </IconButton>
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>3</TableCell>
                                        <TableCell>{documents.doc3.name}</TableCell>
                                        <TableCell>
                                            {
                                                documents.doc3.name != "" && documents.doc3.id.length > 0 &&
                                                <IconButton
                                                    color="secondary"
                                                    disabled={!Boolean(documents.doc3.name)}
                                                    onClick={e => handleDownload(documents.doc3.id,documents.doc3.extension.toLocaleLowerCase(),documents.doc3.name)}
                                                >
                                                    <Download/>
                                                </IconButton>
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
            </DialogContent>
            <DialogActions>
                <Stack spacing={2} sx={{ width : "100%" }}>
                {
                    Boolean(message) &&
                    <Alert variant="outlined" severity="error" >
                        <AlertTitle>Error</AlertTitle>
                        {message}
                    </Alert>
                }
                <Box sx={{ display : "flex" , justifyContent : "flex-end" }}>
                    <Button
                        variant="outlined"
                        disabled={isSending}
                        onClick={(e) => {
                            handleSubmit()
                            // setIsSending(true)
                        }}
                    >Actualizar</Button>
                </Box>
                </Stack>
            </DialogActions>
        </DialogBasic>
    )
}
