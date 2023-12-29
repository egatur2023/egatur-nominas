import API from "@api"
import { Card, CardContent, Chip, Divider, List, ListItem, ListSubheader, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useState } from "react"
import { ResultGetSubscriptionsRoomByRoomId } from "resources/types"

export default function AdmissionsPage(){

    const router = useRouter()
    const roomId = router.query.room_id ? parseInt(router.query.room_id as string) : 0
    // const [admissionByStudent, setAdmissionByStudent] = useState<Record<string,{studentFullName : string , admissions :ResultGetSubscriptionsRoomByRoomId}>>({})
    const { data : admissions , isLoading } = useQuery<Record<string,{studentFullName : string , admissions : ResultGetSubscriptionsRoomByRoomId }>>(
        ['api/admission/[room_id]', roomId],
        async () => await API.fetchAdmissionsByRoomId(roomId),
        {
            initialData : {},
            enabled : roomId > 0 ? true : false
        }
    );
    // console.log(temporal)

    if(isLoading){
        return <div>Loading...</div>
    }

    return (<>

        <List>
            {
                Object.keys(admissions).length > 0 ? Object.keys(admissions).map((keyStudent) => (
                    <>
                    <List key={keyStudent}>
                        <ListSubheader >
                            {admissions[keyStudent].studentFullName}
                            {/* <b>RA{admissions[keyStudent].admissions[0].roomId}</b> */}
                        </ListSubheader>
                        <ListItem>
                            {
                                //@ts-ignore
                                admissions[keyStudent].admissions.map((admission) => (
                                    <Chip
                                        key={`${admission.courseName}${admission.id}`}
                                        label={admission.courseName}
                                        onClick={() => router.push(`/app/admin/admission/${admission.id}`)}
                                        style={{margin : 2}}
                                    />
                                ))
                            }
                        </ListItem>
                    </List>
                    <Divider />
                    </>

                ))
                : <Typography variant="h6" align="center">No hay resultados</Typography>
            }
        </List>
    </>)
}
