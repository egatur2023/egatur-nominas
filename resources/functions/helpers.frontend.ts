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
        let isAuthorized = false
        console.log(`------FINDING => ${stringPermission} { c : ${permission.create} ,r : ${permission.read} ,u : ${permission.update},d : ${permission.delete}}`,)
        if(stringPermission.includes("read")){
            userPermission = `${permission.module.name}.read`.toLowerCase()
            isAuthorized = permission.read
        }
        if(stringPermission.includes("create")){
            userPermission = `${permission.module.name}.create`.toLowerCase()
            isAuthorized = permission.create
        }
        if(stringPermission.includes("update")){
            userPermission = `${permission.module.name}.update`.toLowerCase()
            isAuthorized = permission.update
        }
        if(stringPermission.includes("delete")){
            userPermission = `${permission.module.name}.delete`.toLowerCase()
            isAuthorized = permission.delete
        }
        const result = pagePermission.toLowerCase() === userPermission
        if(result && isAuthorized){
            console.log(`found => (${isAuthorized})${pagePermission.toLowerCase() } === ${userPermission} [${result}]`)
            return true
        }else{
            return false
        }

    })
}
