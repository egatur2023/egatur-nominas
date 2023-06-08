import create from 'zustand'
import { DtoDataReportRow, DtoFilterAttendance } from "resources/types";

type StoreAttendance = {
    careerId: number
    dateStart: string
    dateEnd: string
    setFilters : (property: string, value: any) => void
}

export const useStoreReport = create<StoreAttendance>(set => ({
    careerId: 0,
    dateStart: "",
    dateEnd: "",
    setFilters(property: string, value: any){
        set(state => ({...state , [property]: value }))
    },
}))
