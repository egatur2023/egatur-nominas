import { create } from "zustand";


type AdmissionListFilterStore = {
    careerName : string
    curricularId : number
    // careerId: number
    admission : string
    month : string
    year : string
    schedule : string
    isLoading : boolean
    setFilterAdmission: (filter : "careerName"|"month"|"year"|"schedule"|"curricularId" , value : string) => void
    setLoading: (isLoading : boolean) => void
}
export const useStoreAdmissionListFilter = create<AdmissionListFilterStore>((set ,get) => ({
    careerName :"",
    curricularId :0,
    admission : "",
    month : "" ,
    year : "" ,
    schedule : "" ,
    // careerId : 0 ,
    isLoading : false,
    setFilterAdmission : (filter : string, value : string) => {
        set((state) => ({
            ...state,
            [filter] : value
        }))
    },
    setLoading(isLoading : boolean) {
        set(state => ({ ...state ,isLoading }))
    }
}))
