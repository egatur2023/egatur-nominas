import * as yup from 'yup'
export const schemaModule = yup.object({
    name : yup
        .string()
        .required("Nombre es requerido")
})
