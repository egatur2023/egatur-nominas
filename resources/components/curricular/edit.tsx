import API from "@api";
import { Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DtoEditCurricular } from "resources/types";
import { MonthEnum } from "prisma/prisma-client";



type PropsEditCurricular = {
    fnOnEdit: (isOpen: boolean) => void
    curricularToEdit: DtoEditCurricular
}

export default function EditCurricular({ fnOnEdit, curricularToEdit }: PropsEditCurricular) {
    const queryClient = useQueryClient()
    const months: MonthEnum[] = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]

    const [curricular, setCurricular] = useState<DtoEditCurricular>({
        id: curricularToEdit.id,
        code: curricularToEdit.code,
        month: curricularToEdit.month,
        isRegular: curricularToEdit.isRegular,
        year: curricularToEdit.year
    })
    const mutation = useMutation(API.putCurricular, {
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(["curriculars"])
        },
    })

    const handleChangeCurricular = (property: string, value: any) => {
        setCurricular({ ...curricular, [property]: value })
    }

    const handleSubmit = async () => {
        try {
            mutation.mutate(curricular)//enviar post y actualizar automaticamente la lista
            fnOnEdit(false)//cerrar modal
        } catch (error) {
            console.error(error)
        }
    }

    return (

        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h6">Editar Malla Curricular</Typography>

                    <TextField
                        id="txfCareer"
                        disabled
                        size="small"
                        label="Carrera"
                        defaultValue={curricularToEdit.careerName}
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="lblIsRegular">Mes</InputLabel>
                        <Select
                            labelId="lblIsRegular"
                            id="demo-simple-select"
                            defaultValue={curricularToEdit.month}
                            label="Mes"
                            onChange={(e) => handleChangeCurricular("month", e.target.value)}
                        >
                            {
                                months.map((month, index) =>
                                    <MenuItem key={index} value={month}> {month} </MenuItem>
                                )
                            }

                        </Select>
                    </FormControl>

                    <TextField
                        size="small"
                        fullWidth
                        type="text"
                        label="Año"
                        defaultValue={curricular.year}
                        onChange={e => handleChangeCurricular("year", e.target.value)}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="lblIsRegular">Tipo</InputLabel>
                        <Select
                            labelId="lblIsRegular"
                            id="demo-simple-select"
                            value={curricular.isRegular ? 1 : 0}
                            label="Tipo"
                            onChange={(e) => handleChangeCurricular("isRegular", e.target.value)}
                        >
                            <MenuItem value={1}>Regular</MenuItem>
                            <MenuItem value={0}>Irregular</MenuItem>
                        </Select>
                    </FormControl>
                    <Box display="flex" justifyContent="flex-end">
                        <Button variant="contained" onClick={() => handleSubmit()}>Editar</Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}
