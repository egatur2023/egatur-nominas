import * as yup from 'yup'
export const schemaEditRequestSuper = yup.object({
    requestId : yup.number().min(1,"Solicitud no válida.").required("Solicitud es obligatorio"),
    doc1 : yup.object().shape({
        name : yup.string().required("Se requiere mínimo un documento")
    }),
    reason : yup.string().required("Campo obligatorio")
})
