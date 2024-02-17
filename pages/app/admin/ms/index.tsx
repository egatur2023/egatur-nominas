import { Box, Button, List, Stack } from "@mui/material";
import DialogBasic from "resources/components/dialog.basic";
import { ModuleSystemCreate } from "resources/components/module_system/ModuleSystemCreate";
import ModuleSystemList from "resources/components/module_system/ModuleSystemList";
import { useStoreModuleSystem } from "resources/local/store.module.system";

export default function ModuleSystemPage(){

    const { isOpenCreate ,setIsOpenCreate } = useStoreModuleSystem()
    return (
        <Stack gap={2}>
            <DialogBasic handleOpenDialog={setIsOpenCreate} isOpen={isOpenCreate}>
                <ModuleSystemCreate/>
            </DialogBasic>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="outlined" onClick={() => {
                    setIsOpenCreate(true)
                }}>Nuevo módulo</Button>
            </Box>

            <ModuleSystemList/>
        </Stack>
    )
}
