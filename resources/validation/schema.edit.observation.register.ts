import * as yup from 'yup'
export const schemaEditObservationRegister = yup.object({
    registerId : yup.number(),
    observation : yup.string().required("Fecha Inicio es requerido.")
})
