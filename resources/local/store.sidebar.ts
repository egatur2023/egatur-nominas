import {create} from 'zustand'

export type PageSidebar = {
    title : string
    name : string
    path : string
}

export type GroupPageSidebar = {
    name : string
    pages : PageSidebar[]
}

export type AreaSidebar = {
    name  : string
    groups : (GroupPageSidebar|PageSidebar)[]
}

type StoreSidebar = {
    isOpen : boolean
    currentPage : PageSidebar | null
    expandedGroupName : string
    setCurrentPage : (page : PageSidebar) => void
    setExpandedGroupName : (groupName : string) => void
    setToggleSidebar : ( isOpen : boolean) => void
}


export const useStoreSidebar = create<StoreSidebar>((set) => ({
    isOpen : false,
    currentPage : null,
    expandedGroupName : "",
    setCurrentPage(page){
        set(state => ({...state , isOpen : false , currentPage : page}))
    },
    setExpandedGroupName( groupName ){
        set(state => ({...state , expandedGroupName :  groupName }))

    },
    setToggleSidebar(isOpen){
        set(state => ({ ...state , isOpen }))
    }
}))
