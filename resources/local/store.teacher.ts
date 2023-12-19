import {create} from 'zustand'

export type StoreTeacher  = {
    isOpenDialogCreate : boolean
    isOpenDialogEdit : boolean

    setIsOpenDialogCreate : (isOpen : boolean) => void
    setIsOpenDialogEdit : (isOpen : boolean) => void
}

export const useStoreTeacher =  create<StoreTeacher>((set)=> ({
    isOpenDialogCreate : false,
    isOpenDialogEdit : false,

    setIsOpenDialogEdit : (isOpen) => {
        set( state => ({ ...state , isOpenDialogEdit : isOpen }))
    },
    setIsOpenDialogCreate : (isOpen) => {
        set( state => ({ ...state , isOpenDialogCreate : isOpen }))
    }
}))
