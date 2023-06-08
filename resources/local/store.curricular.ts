import create from 'zustand'
import { Career, CurricularStructure, Module } from "prisma/prisma-client";

type StoreCurricular = {
    selectedCareer : Career | null
    selectedModule : Module | null
    selectedCurricular : CurricularStructure | null
    selectCareer : (career : Career) => void
    selectCurricular : (curricular : CurricularStructure) => void
    selectModule : (module : Module) => void
}


export const useStoreCurricular = create<StoreCurricular>(set => ({
    selectedCareer : null,
    selectedModule : null,
    selectedCurricular : null,
    selectCareer(career : Career){
        set(state => ({
            ...state ,
            selectedCareer : career,
            selectedCurricular : null,
            selectedModule : null
        }))
    },
    selectCurricular(curricular : CurricularStructure){
        set(state => ({
            ...state ,
            selectedCurricular : curricular,
            selectedModule : null
        }))
    },
    selectModule(module : Module){
        set(state => ({...state , selectedModule : module}))
    },
}))
