import { create } from "zustand";

type ModuleSystemStore = {
    isOpenCreate : boolean
    setIsOpenCreate : (isOpen : boolean) => void
}
export const useStoreModuleSystem = create<ModuleSystemStore>((set ,get) => ({

    isOpenCreate : false,
    setIsOpenCreate(isOpen : boolean) {
        set(state => ({ ...state ,isOpenCreate : isOpen }))
    }
}))
