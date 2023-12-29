import { Attendance } from "@prisma/client"
import { create } from "zustand"

type AttendanceStudentStore = {

    attendance: Attendance | null
    isOpenDialogEditAttendance : boolean
    setOpenDialogEditAttendance: (isOpen: boolean) => void
    setAttendanceToEdit: (attendance: Attendance | null) => void
}

export const useStoreAttendanceStudent = create<AttendanceStudentStore>((set, get) => ({
    isOpenDialogEditAttendance: false,
    attendance : null,
    setOpenDialogEditAttendance(isOpen: boolean){
        set(state => ({...state , isOpenDialogEditAttendance: isOpen }))
    },
    setAttendanceToEdit(attendance: Attendance | null){
        set(state => ({...state , attendance }))
    }
}))
