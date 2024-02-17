import { ModuleSystem, Permission } from "@prisma/client";
import { PageSidebar } from "resources/local/store.sidebar";
import { MODULE_VALUES } from "resources/types";

export function urlContentToDataUri(url : string){
    return  fetch(url)
            .then( response => response.blob() )
            .then( blob => new Promise( callback =>{
                let reader = new FileReader() ;
                reader.onload = function(){ callback(this.result) } ;
                reader.readAsDataURL(blob) ;
            }) )
}

export function hasPermission(permissions : (Permission & { module : ModuleSystem})[],stringPermission : MODULE_VALUES){
    return permissions.find( permission => {
        const pagePermission = stringPermission.toLowerCase()
        let userPermission : string = ""
        console.log(`------FINDING =>${stringPermission}`)
        if(stringPermission.includes("read")){
            userPermission = `${permission.module.name}.read`.toLowerCase()
            // console.log(`found =>${permission.module.name}.read`,permission.read)
           return pagePermission.includes(userPermission) && permission.read
        }
        if(stringPermission.includes("create")){
            userPermission = `${permission.module.name}.create`.toLowerCase()
            // console.log(`found =>${permission.module.name}.create`,permission.create)
            return pagePermission.includes(userPermission) && permission.create
        }
        if(stringPermission.includes("update")){
            userPermission = `${permission.module.name}.update`.toLowerCase()
            // console.log(`found =>${permission.module.name}.update`,permission.update)
            return pagePermission.includes(userPermission) && permission.update
        }
        if(stringPermission.includes("delete")){
            userPermission = `${permission.module.name}.delete`.toLowerCase()
            // console.log(`found =>${permission.module.name}.delete`,permission.delete)
            return pagePermission.includes(userPermission) && permission.delete
        }
        // console.log({pagePermission , userPermission , isT : permission.read})

    })
}
