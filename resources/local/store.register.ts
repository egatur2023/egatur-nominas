import {create} from "zustand";
import { DtoResRegister } from "resources/types";

type StoreRegister = {
    isOpenDialogCreateRegister : boolean
    isOpenDialogStudent : boolean
    isOpenDialogEditRegister : boolean
    registerToEdit : DtoResRegister | null

    setOpenDialogStudent : (isOpen : boolean) => void
    setOpenDialogRegister : (isOpen : boolean) => void
    setOpenDialogEditRegister : (isOpen : boolean) => void
    setRegisterToEdit : (register : DtoResRegister) => void
}

export const useStoreRegister = create<StoreRegister>(set => ({
    isOpenDialogStudent : false,
    isOpenDialogCreateRegister : false,
    isOpenDialogEditRegister : false,
    registerToEdit : null,

    setOpenDialogStudent (isOpen) {
        set(state => ({...state , isOpenDialogStudent : isOpen }))
    },
    setOpenDialogRegister(isOpen) {
        set(state => ({...state , isOpenDialogCreateRegister : isOpen}))
    },
    setOpenDialogEditRegister(isOpen){
        set(state => ({...state , isOpenDialogEditRegister : isOpen}))
    },
    setRegisterToEdit(register){
        set(state => ({...state , registerToEdit : register}))
    }
}))
