import create from "zustand";

import { Course, Module, Room } from "prisma/prisma-client"
import { ScheduleType } from "resources/types";

export type TypePanelName = "panelModules" | "panelModule" | "panelCourse"

type DtoEnrollRoom  = {
    moduleId? : number
    courseName : string
    roomId : number
    courseId : number

    roomName : string
    roomHour : string
    roomSchedule : ScheduleType
}

type DtoEnrollSubModule = {
    moduleId : number
    toEnrollSubRooms : DtoEnrollRoom[]
}


type StoreEnrollment = {
    modules : Module[]
    currentModule : Module & { courses? : Course[]} | null
    currentCourse : Course & { rooms? : Room[]} | null
    roomId: number
    panelName : TypePanelName
    toEnrollSubModules : DtoEnrollSubModule[]

    setCurrentModule : ( module : Module) => void
    setModules : ( modules : Module[]) => void
    setCurrentCourse : ( course : Course) => void
    enrollRoom : (room : DtoEnrollRoom) => void
    unenrollRoom : ( room : DtoEnrollRoom) => void
    clearEnrollRooms : () => void
    setPanelName : ( panel : TypePanelName) => void
    setRoomId : ( roomId : number) => void
}

export const useStoreEnrollment = create<StoreEnrollment>(set => ({
    currentModule : null,
    currentCourse : null,
    roomId: 0,
    modules : [],
    panelName : "panelModules",
    toEnrollSubModules : [],
    setCurrentModule( module ){
        set(state => ({...state , panelName : "panelModule" , currentModule : module }))
    },
    setModules( modules ){
        set(state => ({...state , modules }))
    },
    setCurrentCourse( course ){
        set(state => ({...state , currentCourse : course , panelName : "panelCourse"}))
    },
    enrollRoom( room ){
        const { moduleId , courseId , roomId , courseName , roomName , roomHour , roomSchedule } = room
        set(state => {
            let index : number = state.toEnrollSubModules.findIndex(eRoom => eRoom.moduleId == Number(moduleId));
            const updatedToEnrollSubModules = (index !== -1) ?
                [
                    ...state.toEnrollSubModules.filter((_,i) => i !== index ),
                    {
                        ...state.toEnrollSubModules[index] ,
                        toEnrollSubRooms : [
                            ...state.toEnrollSubModules[index].toEnrollSubRooms ,
                            {roomId , courseId , courseName , roomName , roomHour , roomSchedule }
                        ]
                    }
                ]
                : [ ...state.toEnrollSubModules , { moduleId : Number(moduleId) , toEnrollSubRooms : [ { courseId , roomId , courseName , roomName , roomHour , roomSchedule } ] }]

            return { ...state , toEnrollSubModules : updatedToEnrollSubModules }
        })

    },
    unenrollRoom( room ){
        set(state => {
            const indexSubM = state.toEnrollSubModules.findIndex(toEnrollSubM => toEnrollSubM.moduleId == room.moduleId )
            const filteredIndexSubModules = state.toEnrollSubModules.filter((_,i) => i != indexSubM )
            const updatedSubRooms = state.toEnrollSubModules[indexSubM].toEnrollSubRooms.filter((toEnrollSubR => toEnrollSubR.roomId != room.roomId))
            return { ...state , toEnrollSubModules : [...filteredIndexSubModules , { ...state.toEnrollSubModules[indexSubM] , toEnrollSubRooms : updatedSubRooms } ] }
        })
    },
    clearEnrollRooms(){
        set(state => ({...state , toEnrollSubModules : []}))
    },
    setPanelName( panel ){
        set(state =>
            panel === "panelModules" ?
                {...state , panelName : panel , currentModule :  null , currentCourse : null }
                :{...state , panelName : panel }
        )
    },
    setRoomId(roomId){
        set(state => ({...state , roomId}))
    },
}))
