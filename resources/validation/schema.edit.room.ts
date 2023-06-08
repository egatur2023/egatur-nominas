import * as yup from 'yup'
export const schemaEditRoom = yup.object({
    id : yup.number().integer("Salón invalido").min(1,"Por favor selecione una opción").required("Salón es requerido."),
    teacherId : yup.number().integer("Docente invalido"),
    dateStart : yup.string().required("Fecha Inicio es requerido."),
    dateEnd : yup.string().required("Fecha termino es requerido."),
    hourStart : yup.string().required("Hora de inicio es requerido"),
    hourEnd : yup.string().required("Hora de termino es requerido"),
    schedule : yup.string().required("Turno es requerido."),
})
