import { Add } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import RoleCreate from "resources/components/role/RoleCreate";
import RoleList from "resources/components/role/RoleList";
import { MODULES } from "resources/constants";
import { hasPermission } from "resources/functions/helpers.frontend";
import { useStoreRole } from "resources/local/store.role";

export default function PermissionPage(){
    const { data } = useSession()
    const { setIsOpenCreate } = useStoreRole()
    const isAuthorized = hasPermission(data?.user.role.permissions||[],'Roles.create')
    return (
        <Stack>
            {
                isAuthorized &&
               <Box width="100%" justifyContent="flex-end" display="flex">
                    <Button
                        variant="outlined"
                        onClick={() => setIsOpenCreate(true)}
                    >
                        <Add fontSize="small" sx={{ mr : 1}}/>
                        Nuevo rol
                    </Button>
                </Box>
            }

            <RoleList/>
            {
               isAuthorized && <RoleCreate/>
            }
        </Stack>
    )
}
