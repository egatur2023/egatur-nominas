import * as yup from 'yup'
export const schemaCurricular = yup.object({
    month : yup
        .string()
        .required("Mes es requerido"),
    year : yup
        .number()
        .positive()
        .integer()
        .required("Año es requerido")
})
