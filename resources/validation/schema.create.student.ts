import * as yup from 'yup'
export const schemaCreateStudent = yup.object({
    code : yup
        .string()
        .required("Código es requerido"),
    fullName : yup
        .string()
        .required("Nombre completo es requerido"),
    dni : yup
        .string()
        .required("DNI es requerido"),
    telephone : yup
        .string()
        .required("Teléfono es requerido"),
    admision : yup
        .string()
        .required("Admisión es requerido"),
})
