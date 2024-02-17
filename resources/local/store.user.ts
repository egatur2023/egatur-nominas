import { Role, User } from "@prisma/client";
import {  ResultGetUsers, UserWithRole } from "resources/types";
import { create } from "zustand";


interface StoreUser  {
    isOpenCreate : boolean
    isOpenEdit : boolean
    userToEdit : UserWithRole | null
    setIsOpenCreate : (isOpen : boolean) => void
    setIsOpenEdit : (isOpen : boolean) => void
    setUserToEdit : (userToEdit : UserWithRole|null) => void
}
export const useStoreUser = create<StoreUser>((set)=>({
    isOpenCreate : false,
    isOpenEdit : false,
    userToEdit : null,
    setIsOpenCreate : (isOpen : boolean) => set({isOpenCreate : isOpen}),
    setIsOpenEdit : (isOpen : boolean) => set({isOpenEdit : isOpen}),
    setUserToEdit : (userToEdit : UserWithRole |null ) => set({userToEdit}),
}))
