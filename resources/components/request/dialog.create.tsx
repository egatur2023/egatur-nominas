import API, { instanceAxios } from "@api";
import { Circle, ErrorSharp, UploadFile } from "@mui/icons-material";
import { Alert, AlertTitle, Button, Card, CardContent, Fab, IconButton, List, ListItem, ListItemAvatar, ListItemText, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useStoreRequest } from "resources/local/store.request";
import { DtoCreateRequest } from "resources/types";
import { schemaCreateRequest } from "resources/validation/schema.create.request";
import DialogBasic from "../dialog.basic";


export default function DialogCreateRequest({userId } : {userId : number }){

    const { isOpenDialogCreate , setIsOpenDialogCreate , subRoomId  } = useStoreRequest()
    const [message , setMessage] = useState<string>("")
    const mutation = useMutation(API.postRequest,{
        onSuccess(data, variables, context) {
            setSubmitting(false)
            resetForm()
            setIsOpenDialogCreate(false)
        },
        onError(error : any, variables, context) {
            if(axios.isAxiosError(error) && error){
                const err : any = error as AxiosError
                setMessage(String(err?.response?.data?.message))
            }else{
                setMessage("500")
                console.error("DESCONOCIDO",error)
            }
        },
    })
    const [documents , setDocuments] = useState<{doc1 : File | any , doc2 : File|any , doc3 : File|any}>({
        doc1 : null,
        doc2 : null,
        doc3 : null
    })
    const { values:request ,handleChange , handleSubmit , errors , touched , isSubmitting , setSubmitting , setFieldValue , resetForm  } = useFormik<DtoCreateRequest>({
        validationSchema : schemaCreateRequest,
        initialValues : {
            reason : "",
            subRoomId : 0,
            userId : userId,
            date : DateTime.now().toUTC().toISODate(),
            doc1 : { name :"" , extension : ""},
            doc2 : { name :"" , extension : ""},
            doc3 : { name :"" , extension : ""},
        },
        async onSubmit(validatedRequest) {
            setSubmitting(true)
            const formRequest = new FormData()
            const composedRequest = JSON.stringify({...validatedRequest , subRoomId })
            formRequest.append("request", composedRequest )
            if(documents.doc1) formRequest.append("document1",documents.doc1)
            if(documents.doc2) formRequest.append("document2",documents.doc2)
            if(documents.doc3) formRequest.append("document3",documents.doc3)

            mutation.mutate(formRequest)
        },
    })
    const onChangeFile = async (e : React.ChangeEvent<HTMLInputElement> , property : string) => {
        if(!e.target.files) return ;
        const file = e.target.files[0];
        let fileName = file.name.split(".")
        let extension = fileName.pop()?.toUpperCase() || ""
        await setFieldValue( property , { name : fileName.join() , extension })
        setDocuments({...documents , [property] : file})
    }

    return (
        <DialogBasic isOpen={isOpenDialogCreate} handleOpenDialog={(isOpen) => {
            resetForm()
            setMessage("")
            setIsOpenDialogCreate(isOpen)
        }}>
            <Card variant="outlined">
                <CardContent>
                    <Stack spacing={2}>
                        <Typography>Nueva solicitud</Typography>
                        <TextField name="reason" onChange={handleChange} label="Motivo" multiline rows={2} size="small"/>
                        <TextField
                            label="Documento 1"
                            name="doc1"
                            placeholder={request.doc1.name || "Carga un archivo por favor."}
                            onChange={async(e) => await setFieldValue("doc1", { ...request.doc1 , name : String(e.target.value) } )}
                            error={touched.doc1 && Boolean(errors.doc1)}
                            helperText={errors.doc1?.name || ""}
                            InputLabelProps={{
                                shrink : Boolean(request.doc1)
                            }}
                            InputProps={{
                                endAdornment :  (
                                    <>
                                    {request.doc1.extension}
                                    <Tooltip title="PDF | DOCX | PNG | JPG">
                                    <IconButton component="label" >
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
                            placeholder={request.doc2.name || "Carga un archivo por favor."}
                            onChange={async(e) => await setFieldValue("doc2", { ...request.doc2 , name : String(e.target.value) } )}
                            InputLabelProps={{
                                shrink : Boolean(request.doc2)
                            }}
                            InputProps={{
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
                            placeholder={request.doc3.name || "Carga un archivo por favor."}
                            onChange={async(e) => await setFieldValue("doc3",{ ...request.doc3 , name : String(e.target.value) })}
                            InputLabelProps={{
                                shrink : Boolean(request.doc3)
                            }}
                            InputProps={{
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
                        <TextField label="Fecha de envio" name="date" type="date" defaultValue={ request.date} InputProps={{ readOnly : true }}/>
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
                                disabled={isSubmitting}
                                onClick={(e) => {
                                //@ts-ignore
                                handleSubmit(e)
                            }}>Enviar solicitud</Button>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </DialogBasic>
    )
}
