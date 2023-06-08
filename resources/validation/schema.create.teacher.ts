import * as yup from 'yup'
export const schemaTeacher = yup.object({
    fullName : yup
        .string()
        .required("Nombre completo es requerido"),
    dni : yup
        .string()
        .required("DNI es requerido"),
    telephone : yup
        .string()
        .required("Teléfono es requerido"),
})
