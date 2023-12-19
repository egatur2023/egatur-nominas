import {create} from 'zustand'
import { DtoDataReportRow } from "resources/types";

type StoreCurricular = {
    dataReport1 : DtoDataReportRow[]

    setDateReport1 : (rows : DtoDataReportRow[]) => void
}

export const useStoreReport = create<StoreCurricular>(set => ({
    dataReport1 : [],
    setDateReport1(rows){
        set(state => ({...state , dataReport1 : rows}))
    },
}))
