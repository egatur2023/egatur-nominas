import * as yup from 'yup'
export const schemaModuleSystem = yup.object({
    name : yup
        .string()
        .required("Nombre es requerido")
})
