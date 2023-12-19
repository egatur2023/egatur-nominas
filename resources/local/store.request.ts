import { DtoResRequestsForAdmin, DtoResRequestsForSuper } from 'resources/types'
import {create} from 'zustand'

type StoreRequest = {
    isOpenDialogCreate : boolean
    subRoomId : number
    isOpenDialogEdit : boolean
    isOpenDialogEditForSuper : boolean
    requestToEdit : DtoResRequestsForAdmin | null
    requestToEditForSuper : DtoResRequestsForSuper | null

    setIsOpenDialogCreate : (isOpen : boolean ) => void
    setSubRoomId : (id : number) => void
    setRequestToEdit : (request : DtoResRequestsForAdmin) => void
    setIsOpenDialogEdit : (isOpen : boolean ) => void
    setIsOpenDialogEditForSuper : (isOpen : boolean ) => void
    setRequestToEditForSuper : (request : DtoResRequestsForSuper) => void
}

export const useStoreRequest = create<StoreRequest>((set,get) => ({
    isOpenDialogCreate : false,
    subRoomId : 0,
    isOpenDialogEdit : false,
    isOpenDialogEditForSuper : false,
    requestToEdit : null,
    requestToEditForSuper : null,

    setIsOpenDialogCreate(isOpen) {
        set( state => ({...state , isOpenDialogCreate : isOpen}))
    },
    setIsOpenDialogEdit(isOpen) {
        set( state => ({...state , isOpenDialogEdit : isOpen}))
    },
    setIsOpenDialogEditForSuper(isOpen) {
        set( state => ({...state , isOpenDialogEditForSuper : isOpen}))
    },
    setSubRoomId(id) {
        set( state => ({...state , subRoomId : id}) )
    },
    setRequestToEdit(request) {
        set( state => ({...state , requestToEdit : request}) )
    },
    setRequestToEditForSuper(request) {
        set( state => ({...state , requestToEditForSuper : request}) )
    },
    getRoomId(){
        return get().subRoomId
    }
}))
