import * as yup from 'yup'
export const schemaCreateRegister = yup.object({
    careerId : yup.number().integer("Carrera invalida").min(1,"Por favor selecione una opción").required("Carrera es requerido."),
    curricularId : yup.number().min(1,"Por favor selecione una opción").integer("Curricula invalida").required("Currícula es requerido."),
    studentId : yup.number().integer("Esstudiante invalido").min(1,"Por favor selecione una opción").required("Estudiante es requerido."),
    dateStart : yup.string().required("Fecha Inicio es requerido."),
    scheduleAdmision : yup.string().required("Turno es requerido."),
})
