import { Accordion, AccordionDetails, AccordionSummary, List, ListItemButton,ListItem, ListItemText, Typography } from "@mui/material";
import { SyntheticEvent } from "react";
import { CalendarMonth, ExpandMore, FiberManualRecord } from '@mui/icons-material'
import { useRouter } from "next/router";
import { GroupPageSidebar, PageSidebar } from "resources/local/store.sidebar";
import { useStoreSidebar } from "resources/local/store.sidebar";
import { ModuleSystem, Permission, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { hasPermission } from "resources/functions/helpers.frontend";

// permissions : (Permission & { module : ModuleSystem})[]
function ButtonPage({page } : {page : PageSidebar }){
    const router = useRouter()
    const { data } = useSession()
    const { currentPage , setCurrentPage } = useStoreSidebar()
    const handleClickButtonPage = (page : PageSidebar) => {
        setCurrentPage(page)
        router.push(page.path)
    }



    if( hasPermission(data?.user.role.permissions || [],page.permissions) != null){
        return (
        <ListItemButton
        selected={currentPage === page}
        sx={{ mx : 2 , borderRadius : "8px" }}
        onClick={()=> handleClickButtonPage(page)}
        >
            <CalendarMonth fontSize="small" sx={{ mr : 2 }} />
            <ListItemText>{page.name}</ListItemText>
        </ListItemButton>
        )
    }

    return <></>
}


function AccordionPage({group} : {group : GroupPageSidebar}){
    const router = useRouter()
    const { expandedGroupName , setExpandedGroupName } = useStoreSidebar()
    const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
        setExpandedGroupName(expandedGroupName ? panel : "")
    }

    const handleClickButtonPage = (page : PageSidebar) => {
        router.push(page.path)
    }

    return (
        <ListItem key={`LIA${group.name}`}>
            <Accordion expanded={ expandedGroupName === group.name} onChange={handleChange(group.name)}
                elevation={0}
                disableGutters
                square
                sx={{
                    ":before" : {
                        display: "none"
                    },
                    width : "100%",
                }}
                >
                <AccordionSummary
                id={`${group.name}-header`}
                expandIcon={<ExpandMore />}
                aria-controls={`${group.name}bh-content`}
                sx={{
                    "&:hover" : {
                        bgcolor : t => t.palette.grey[100]
                    },
                    display: "flex" ,
                    flexDirection:"row",
                    my : 0,
                    borderRadius : "8px"
                }}
                >
                    <CalendarMonth fontSize="small" sx={{ mr : 2 }} />
                    <Typography>{group.name}</Typography>

                </AccordionSummary>
                <AccordionDetails sx={{ p : 0}}>
                    <List sx={{ pb: 0 }}>
                        {
                            group.pages.map((page , ipage) => (
                                <ListItemButton key={`${page.title}${ipage}`} onClick={()=> handleClickButtonPage(page)}>
                                    <FiberManualRecord fontSize="small" sx={{ fontSize : "0.5rem", mr : 2 }} />
                                    <ListItemText primary={`${page.title}`} />
                                </ListItemButton>
                            ))
                        }
                    </List>
                </AccordionDetails>
            </Accordion>
        </ListItem>
    )
}

type PropsItemSidebar = {
    items : (GroupPageSidebar|PageSidebar)[]
}

const AccordionSidebar = ( { items } : PropsItemSidebar ) => {

    return (
        <>
            {
                items.map((item,index) => (
                    item.hasOwnProperty("path") ?
                        <ButtonPage key={`ITENPAGE${item.name}${index}`} page={item as PageSidebar}/>
                        :<AccordionPage key={`ACCORDION${item.name}`} group={item as GroupPageSidebar}/>
                ))
            }
        </>
    )
}

export default AccordionSidebar
