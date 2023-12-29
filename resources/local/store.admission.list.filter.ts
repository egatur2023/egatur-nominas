import { create } from "zustand";

type AdmissionListFilterStore = {
    careerId : number
    curricularId : number
    admision : string
    dateStart : string
    dateEnd : string

    isLoading : boolean
    setParam: (param : string, value  : any) => void
    setLoading: (isLoading : boolean) => void
}
export const useStoreAdmissionListFilter = create<AdmissionListFilterStore>((set ,get) => ({
    careerId :0,
    curricularId :0,
    admision : "",
    dateStart : "2023-01-01" ,
    dateEnd : "2023-01-01" ,

    isLoading : false,
    setParam : (param, value) => {
        set((state) => ({
            ...state,
            [param]: value,
        }))
    },
    setLoading(isLoading : boolean) {
        set(state => ({ ...state ,isLoading }))
    }
}))
