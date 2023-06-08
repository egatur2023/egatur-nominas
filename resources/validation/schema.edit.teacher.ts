import * as yup from 'yup'
export const schemaTeacher = yup.object({
    fullName : yup
        .string(),
    dni : yup
        .string().required("Se necesita un DNI"),
    telephone : yup
        .string(),
})
