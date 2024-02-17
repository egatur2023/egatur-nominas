import { MouseEvent , KeyboardEvent } from 'react';
import { Container,Drawer,Box,List,ListSubheader } from '@mui/material'
import AccordionSidebar from '../components/sidebar/accordion';
import TopAppBar from 'resources/components/top.appbar';
import { itemsSidebarAdmin  } from 'resources/routes';
import { useSession } from 'next-auth/react';
import { AreaSidebar, useStoreSidebar } from 'resources/local/store.sidebar';
import { Session } from 'next-auth';

const SystemLayout = (props : any) => {

    const { isOpen , setToggleSidebar } = useStoreSidebar()
    const { data , status } = useSession();
    const toggleDrawer = (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as KeyboardEvent).key === 'Tab' ||
          (event as KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setToggleSidebar(open)
    }

    const getItemsSidebardByRole = (data : Session|null) => {
        if(data?.user != undefined &&  data.user.role != undefined){
            // if(data.user.role.name == "ADMIN") {
                return itemsSidebarAdmin
            // }else if(data.user.role.name == "SUPERVISOR"){
            //     return itemsSidebarSupervisor
            // }else{
            //     return itemsSidebarAdvisor
            // }
        }
        return []

    }

    const ListMenu = ({itemsSidebar} : {itemsSidebar : AreaSidebar[]}) => (
      <Box
        sx={{ width : 250 , pt : 2 }}
        role="presentation"
        onKeyDown={toggleDrawer(false)}
      >
        {
            itemsSidebar.map((area, index) => (
                <List
                    key={`${area.name}${index}`}
                    subheader={
                        <ListSubheader
                            sx={{
                                px : 4.3 ,
                                py : 1 ,
                                textTransform : "uppercase" ,
                                lineHeight : "16px" ,
                                fontSize:"10px" ,
                                fontWeight : "bolder"
                            }}>
                            {area.name}
                        </ListSubheader>
                    }
                >
                    <AccordionSidebar items={area.groups}/>
                </List>
            ))
        }
      </Box>
    )
    return <div>
        <TopAppBar/>
         <Container maxWidth="xl">
            <Drawer
              anchor='left'
              open={isOpen}
              onClose={toggleDrawer(false)}>

            <ListMenu
                itemsSidebar={getItemsSidebardByRole(data)}
            />
            </Drawer>
          <main>
              {props.children}
          </main>
         </Container>
    </div>
}

export default SystemLayout
