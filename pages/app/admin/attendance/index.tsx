import API from "@api"
import { useQuery } from "@tanstack/react-query"
import { DateTime } from "luxon"
import { useState } from "react"
import FilterAttendance from "resources/components/attendance/filter"
import { useStoreReport } from "resources/local/store.attendance"
import { DtoFilterAttendance } from "resources/types"

export default function Attendance(){

    return (
        <>
            <FilterAttendance></FilterAttendance>
        </>
    )
}