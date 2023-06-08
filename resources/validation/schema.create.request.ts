import * as yup from 'yup'
export const schemaCreateRequest = yup.object({
    // doc1 : yup.mixed().test("Nombre no valido",(doc : any) => Boolean(doc.name)),
    doc1 : yup.object().shape({
        name : yup.string().required("Se requiere mínimo un documento")
    }),
    userId : yup.number().integer().min(1,"Usuario no valido.").required("No se reconoce su usuario.")
})
