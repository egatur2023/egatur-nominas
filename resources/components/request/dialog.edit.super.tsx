import API from "@api";
import { UploadFile } from "@mui/icons-material";
import { Alert, AlertTitle, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, Fab, FormControl, FormControlLabel, FormHelperText, FormLabel, IconButton, List, ListItem, ListItemAvatar, ListItemText, Radio, RadioGroup, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import React, {  useState } from "react";
import { useStoreRequest } from "resources/local/store.request";
import {  DtoEditRequestSuper, UploadedDocument } from "resources/types";
import { schemaEditRequestSuper } from "resources/validation/schema.edit.request.super";
import DialogBasic from "../dialog.basic";


export default function DialogEditRequestSuper(){
    const qc = useQueryClient()
    const [isSending,setIsSending] = useState(false)
    const { isOpenDialogEditForSuper , setIsOpenDialogEditForSuper , requestToEditForSuper ,setRequestToEditForSuper  } = useStoreRequest()

    const [documents , setDocuments] = useState<{doc1 : File | any , doc2 : File|any , doc3 : File|any}>({
        doc1 : null,
        doc2 : null,
        doc3 : null
    })

    const documentsParsed : {
        doc1 : UploadedDocument ,
        doc2 : UploadedDocument ,
        doc3 : UploadedDocument
    } = requestToEditForSuper?.documents ? JSON.parse(String(requestToEditForSuper?.documents)) :
    {
        doc1 : { name :"" , extension : "" , id : ""},
        doc2 : { name :"" , extension : "" , id : ""},
        doc3 : { name :"" , extension : "" , id : ""},
    }

    const [message , setMessage] = useState<string>("")
    const mutation = useMutation(API.putRequestSuper,{
        onSuccess(data, variables, context) {
            qc.invalidateQueries(["api/request/admin"])
            setIsSending(false)
            resetForm()
            setIsOpenDialogEditForSuper(false)
            setRequestToEditForSuper(null)
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
        isSubmitting ,
        setSubmitting ,
        setFieldValue ,
        resetForm  } = useFormik<DtoEditRequestSuper>({
        validationSchema : schemaEditRequestSuper,
        initialValues : {
            requestId : requestToEditForSuper?.requestId || 0,
            reason : requestToEditForSuper?.reason || "",
            doc1 : {...documentsParsed.doc1},
            doc2 : {...documentsParsed.doc2},
            doc3 : {...documentsParsed.doc3},
        },
        enableReinitialize : requestToEditForSuper != null,
        async onSubmit(validatedRequest ) {
            setSubmitting(true)
            const formRequest = new FormData()
            const composedRequest = JSON.stringify({...validatedRequest })
            formRequest.append("request", composedRequest )
            if(documents.doc1) formRequest.append("document1",documents.doc1)
            if(documents.doc2) formRequest.append("document2",documents.doc2)
            if(documents.doc3) formRequest.append("document3",documents.doc3)
            mutation.mutate(formRequest)
        },
    })

    // console.log(isSubmitting)

    const onChangeFile = (e : React.ChangeEvent<HTMLInputElement> , property : string) => {
        if(!e.target.files) return ;
        const file = e.target.files[0];
        let fileName = file.name.split(".")
        let extension = fileName.pop()?.toUpperCase() || ""
        setFieldValue( property , { name : fileName.join() , extension })
        setDocuments({...documents , [property] : file})
    }

    return (
        <DialogBasic isOpen={isOpenDialogEditForSuper} handleOpenDialog={(isOpen) => {
            resetForm()
            setMessage("")
            setIsOpenDialogEditForSuper(isOpen)
        }}>
            <DialogTitle>
                <Typography>Actualizar solicitud</Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
                    <Stack spacing={2}>

                        <TextField
                            name="reason"
                            onChange={handleChange}
                            label="Motivo"
                            multiline
                            rows={2}
                            size="small"
                            value={request.reason}
                            InputLabelProps={{
                                shrink : true
                            }}
                        />
                        <TextField
                            label="Observación"
                            variant="outlined"
                            multiline
                            rows={3}
                            disabled
                            defaultValue={requestToEditForSuper?.observation}
                            InputLabelProps={{
                                shrink : true
                            }}
                        />

                        <TextField
                            label="Documento 1"
                            name="doc1"
                            value={request.doc1.name}
                            onChange={async(e) => await setFieldValue("doc1", { ...request.doc1 , name : String(e.target.value) } )}
                            error={touched.doc1 && Boolean(errors.doc1)}
                            helperText={errors.doc1?.name || ""}
                            InputLabelProps={{
                                shrink : Boolean(request.doc1)
                            }}
                            InputProps={{
                                readOnly: true,
                                endAdornment :  (
                                    <>
                                    {request.doc1.extension}
                                    <Tooltip title="PDF | DOCX | PNG | JPG">
                                    <IconButton component="label">
                                        <UploadFile fontSize="medium"/>
                                        <input onChange={ e => onChangeFile(e , "doc1")} hidden type="file" accept="application/pdf , application/vnd.openxmlformats-officedocument.wordprocessingml.document , application/msword"  />
                                    </IconButton>
                                    </Tooltip>
                                    </>
                                )
                            }}
                        />
                        <TextField
                            label="Documento 2"
                            value={request.doc2.name}
                            onChange={async(e) => await setFieldValue("doc2", { ...request.doc2 , name : String(e.target.value) } )}
                            InputLabelProps={{
                                shrink : Boolean(request.doc2)
                            }}
                            InputProps={{
                                readOnly: true,
                                endAdornment :  (
                                    <>
                                    {request.doc2.extension}
                                    <Tooltip title="PDF | DOCX | PNG | JPG">
                                    <IconButton component="label" >
                                        <UploadFile fontSize="medium"/>
                                        <input onChange={ e => onChangeFile(e , "doc2")} hidden type="file" accept="application/pdf , application/vnd.openxmlformats-officedocument.wordprocessingml.document , application/msword" />
                                    </IconButton>
                                    </Tooltip>
                                    </>
                                )
                            }}
                        />
                        <TextField
                            label="Documento 3"
                            value={request.doc3.name}
                            onChange={async(e) => await setFieldValue("doc3",{ ...request.doc3 , name : String(e.target.value) })}
                            InputLabelProps={{
                                shrink : Boolean(request.doc3)
                            }}
                            InputProps={{
                                readOnly: true,
                                endAdornment :  (
                                    <>
                                    {request.doc3.extension}
                                    <Tooltip title="PDF | DOCX | PNG | JPG">
                                    <IconButton component="label" >
                                        <UploadFile fontSize="medium"/>
                                        <input onChange={ e => onChangeFile(e , "doc3")} hidden type="file" accept="application/pdf , application/vnd.openxmlformats-officedocument.wordprocessingml.document , application/msword" />
                                    </IconButton>
                                    </Tooltip>
                                    </>
                                )
                            }}
                        />

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
                        endIcon={isSending ? <CircularProgress size={10}></CircularProgress> : <></>}
                        onClick={(e) => {
                            handleSubmit()
                            setIsSending(true)
                            console.log("editado")
                        }}
                    >Actualizar</Button>
                </Box>
                </Stack>
            </DialogActions>
        </DialogBasic>
    )
}
