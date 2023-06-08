import * as yup from 'yup'
export const schemaEditRegister = yup.object({
    registerId : yup.number(),
    dateStart : yup.string().required("Fecha Inicio es requerido."),
    dateEnd : yup.string(),
})
