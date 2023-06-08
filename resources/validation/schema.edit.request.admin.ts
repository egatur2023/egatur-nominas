import { StateUpdate } from '@prisma/client'
import * as yup from 'yup'
export const schemaEditRequestAdmin = yup.object({
    observation : yup.string().required("Campo obligatorio."),
    stateUpdate : yup.mixed<StateUpdate>().oneOf(Object.values(StateUpdate).filter(state => state !== "PENDIENTE"),"Debe selecionar una opción.").required("Campo obligatorio")
})
