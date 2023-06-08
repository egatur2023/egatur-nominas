import { DateTime } from "luxon"
import { WEEKDAYS } from "resources/constants"
import { DtoCreateRoom, DtoEditRoom } from "resources/types"

export const getWeekDaysChecked  = (frecuencyString : string) => {
    const abbrevationsDays = frecuencyString.split("-")
    let weekDaysChecked = WEEKDAYS.filter(day => abbrevationsDays.find(abb => abb === day.abbrevation) )
    let arrayWeekDaysValues : any = {}
    weekDaysChecked.forEach(day => arrayWeekDaysValues[day.position] = true )
    return arrayWeekDaysValues
}

type ParamsToCompose = {
    dateStart : string
    schedule : string
    careerName : string
    section : string
}

export const composeNameRoom = ({dateStart , careerName , section , schedule} : ParamsToCompose) => {
    //GA-FEB-2022-M(A)
    let twoLettersCareer = careerName.substring(0,2).toUpperCase()
    let threeLettersMonth = DateTime.fromISO(dateStart).setLocale("pe").toFormat("LLL").substring(0,3).toUpperCase()
    let year = DateTime.fromISO(dateStart).toFormat("yyyy")
    let oneLetterSchedule = String(schedule).substring(0,1)
    return `${twoLettersCareer}-${threeLettersMonth}-${year}-${oneLetterSchedule} (${section})`
}

