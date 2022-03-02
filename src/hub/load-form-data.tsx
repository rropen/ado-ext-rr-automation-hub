import { JSONSchema7} from 'json-schema';

import {
    GraphUser
} from "@byndit/azure-devops-extension-api/Graph";

// import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces";
import { TeamProjectReference } from "@byndit/azure-devops-extension-api/Core/Core";
// import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces";


import {IProjectInfo } from "@byndit/azure-devops-extension-api/Common";

import * as ADOAPI from "./ado-api";
import * as recFind from"./recursive-find";
import {LogError, Logger} from "./logger"

/**
 * Mapping of widgets in the uiSchema to what is mapped to the underlying formData 
 * 
 * @param user 
 * @param widgetname 
 * @returns 
 */
export const getWidgetMetaMapping = (user: GraphUser | undefined, widgetname:string ) :string => {
    switch(widgetname){
        case "currentIdentityWidget":
            return user!.mailAddress
        case "currentIdentitiesWidget":
            return user!.mailAddress
        case "currentUserName":
            return user!.displayName
        case "currentUserEmail":
            
            return user!.mailAddress
        default:
            throw Error(`Could not find mapping for widget ${widgetname}`)
    }
}

/**
 * prepopulate form and update schema with any context info from ADO (user, project etc)
 * @param schema current schema
 * @param uiSchema current uiSchema
 * @returns new formData object
 */
export const loadForm = async (schema:JSONSchema7, uiSchema:any=undefined) => {     
    var formData = {}

    try{
        var currentUser = await ADOAPI.getCurrentUser()
        await updateIdentitiesIntoFormData(uiSchema,formData, currentUser!)
        var projects = await ADOAPI.getProjects()
        Logger.debug(`loaded projects: ${JSON.stringify(projects!)}`) 
        await updateProjectsIntoSchema(projects!,uiSchema, schema)
        var currentProject = await ADOAPI.getCurrentProject()
        Logger.debug(`loaded current project: ${JSON.stringify(currentProject!)}`) 
        await updateCurrentProjectIntoFormData(currentProject!,uiSchema, formData!)
        Logger.debug(`returning formData: ${JSON.stringify(formData)}`) 
        return formData
    } catch (e) {
        LogError(e);
    }    

}

/**
 * find any identity, name or email widgets and set the corresponding formData to the passed current user
 * @param uiSchema current UIschema
 * @param formData current formData
 * @param currentUser current User
 */
const updateIdentitiesIntoFormData = (uiSchema:{}, formData:any, currentUser:GraphUser) =>
{
    // switch to lodash
    // loop through widgets to see which are customWidgets to set formData before loading
    ["currentIdentityWidget","currentIdentitiesWidget","currentUserName", "currentUserEmail" ].forEach( element=> {
        const widgetKeys = recFind.findNestedObject(uiSchema!,"ui:widget",element)
        Logger.debug(`widgetKeys for ${element}: ${JSON.stringify(widgetKeys)}`)
        var widget:string = element
        widgetKeys.forEach(element => {
                let ob:any = formData
                element.forEach((subelement, idx, array) => {
                    if (idx === array.length - 1){ 
                        ob[subelement] = getWidgetMetaMapping(currentUser, widget)
                    }
                    else{
                        if(!(subelement in ob))
                           {
                               ob[subelement] = {}
                               
                           }
                           ob = ob[subelement]
                       }
                });  
        });
    })
}

/**
 * find any currentProject widgets and set the corresponding enum in the schema
 * @param projects list of projects 
 * @param uiSchema current uiSchema
 * @param schema current schema
 */
const updateProjectsIntoSchema = (projects:TeamProjectReference[], uiSchema:{}, schema:JSONSchema7) =>
{
    const widgetKeys = recFind.findNestedObject(uiSchema!,"ui:widget","currentProject")
        Logger.debug(`widgetKeys for Projects: ${JSON.stringify(widgetKeys)}`)
        Logger.debug(`projects: ${JSON.stringify(projects)}`)
        var names = projects!.map((item)=>{ return item.name});
        Logger.debug(`names: ${JSON.stringify(names)}`)

        var widget:string = "currentProject"
        widgetKeys.forEach(element => {
                let ob:any = schema["properties"]
                element.forEach((subelement, idx, array) => {
                    if (idx === array.length - 1){ 
                        ob[subelement]["enum"] = names
                    }
                    else{
                        if(!(subelement in ob))
                        {
                            ob[subelement] = {}
                            ob[subelement]["properties"] = {}
                        }
                        ob = ob[subelement]["properties"]
                    }
                });  
        })
}

/**
 * find any currentProject widgets and set the corresponding formData to the passed projectInfo
 * 
 * @param project ADO project info
 * @param uiSchema schema for the UI form
 * @param formData current formdata 
 */
const updateCurrentProjectIntoFormData = (project:IProjectInfo, uiSchema:{}, formData:any) =>
{
    const widgetKeys = recFind.findNestedObject(uiSchema!,"ui:widget","currentProject")
        Logger.debug(`widgetKeys for currentProject: ${JSON.stringify(widgetKeys)}`)
        widgetKeys.forEach(element => {
                let ob:any = formData
                element.forEach((subelement, idx, array) => {
                    if (idx === array.length - 1){ 
                        ob[subelement] = project.name
                    }
                    else{
                        if(!(subelement in ob))
                        {
                            ob[subelement] = {}
                        }
                        ob = ob[subelement]
                    }
                });  
        })
}