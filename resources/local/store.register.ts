import {create} from "zustand";
import { DtoResRegister } from "resources/types";

type StoreRegister = {
    isOpenDialogCreateRegister : boolean
    isOpenDialogStudent : boolean
    isOpenDialogEditRegister : boolean
    dialogObservationIsOpen : boolean,
    registerToEdit : DtoResRegister | null
    registerEditObservation : DtoResRegister | null

    setOpenDialogStudent : (isOpen : boolean) => void
    setOpenDialogRegister : (isOpen : boolean) => void
    setOpenDialogEditRegister : (isOpen : boolean) => void
    setOpendialogEditObservation : (isOpen : boolean) => void
    setRegisterToEdit : (register : DtoResRegister) => void
    setRegisterToEditObservation : (register : DtoResRegister | null) => void
}

export const useStoreRegister = create<StoreRegister>(set => ({
    isOpenDialogStudent : false,
    isOpenDialogCreateRegister : false,
    isOpenDialogEditRegister : false,
    registerToEdit : null,
    registerEditObservation : null,
    dialogObservationIsOpen : false,

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
    },
    setRegisterToEditObservation(register : DtoResRegister | null){
        set(state => ({...state , registerEditObservation : register}))
    },
    setOpendialogEditObservation(isOpen : boolean){
        set(state => ({...state , dialogObservationIsOpen : isOpen}))
    }
}))
