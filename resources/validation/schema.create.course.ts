import * as yup from 'yup'
export const schemaCourse = yup.object({
    name: yup
        .string()
        .required("Nombre es requerido"),
    type: yup
        .string()
        .required("Tipo de curso requerido"),
    sessions: yup
        .number()
        .positive("La cantidad de sesiones debe ser positiva")
        .integer()
        .required("Sesiones requeridas"),
})
