import { create } from 'zustand'

type StoreRole = {
    isOpenCreate : boolean
    setIsOpenCreate : (isOpen : boolean) => void
}
export const useStoreRole = create<StoreRole>(set => ({
    isOpenCreate : false,
    setIsOpenCreate(isOpen) {
        set(state => ({...state, isOpenCreate : isOpen}))
    },
}))
