import * as yup from 'yup'
export const schemaCareer = yup.object({
    name : yup
        .string()
        .required("Nombre es requerido")
})
