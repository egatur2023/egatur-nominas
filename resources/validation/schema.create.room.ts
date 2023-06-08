import * as yup from 'yup'
export const schemaCreateRoom = yup.object({
    courseId : yup.number().integer("Curso invalido").min(1,"Por favor selecione una opción").required("Carrera es requerido."),
    teacherId : yup.number().integer("Docente invalido"),
    dateStart : yup.string().required("Fecha Inicio es requerido."),
    dateEnd : yup.string().required("Fecha termino es requerido."),
    hourStart : yup.string().required("Hora de inicio es requerido"),
    hourEnd : yup.string().required("Hora de termino es requerido"),
    schedule : yup.string().required("Turno es requerido."),
    section: yup.string()
})
