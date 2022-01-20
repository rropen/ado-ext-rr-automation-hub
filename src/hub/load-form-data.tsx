import { JSONSchema7} from 'json-schema';

import {
    GraphUser
} from "@byndit/azure-devops-extension-api/Graph";

import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces";
import {IProjectInfo } from "@byndit/azure-devops-extension-api/Common";

import * as ADOAPI from "./ado-api";
import * as recFind from"./recursive-find";

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

export const loadForm = async (schema:JSONSchema7, uiSchema:any=undefined) => {     
    var formData = {}

    // await ADOAPI.getCurrentUser().then(currentUser => { 
    //     updateIdentitiesIntoFormData(uiSchema,formData, currentUser!)
    //     }).then(value => ADOAPI.getProjects())
    //         .then(projects => { 
    //             console.log(`loaded projects: ${JSON.stringify(projects!)}`) 
    //             updateProjectsIntoSchema(projects!,uiSchema, schema)
    //             })
    //             .then(value => ADOAPI.getCurrentProject())
    //                 .then(currentProject => { 
    //                     console.log(`loaded current project: ${JSON.stringify(currentProject!)}`) 
    //                     updateCurrentProjectIntoFormData(currentProject!,uiSchema, formData!)
    //                     })
    //                     .finally( () => {
    //                             // this.setState({showADOLoadedWidgets:true});
    //                             console.log(`formData: ${JSON.stringify(formData!)}`)
    //                         })

    try{
        var currentUser = await ADOAPI.getCurrentUser()
        await updateIdentitiesIntoFormData(uiSchema,formData, currentUser!)
        var projects = await ADOAPI.getProjects()
        console.log(`loaded projects: ${JSON.stringify(projects!)}`) 
        await updateProjectsIntoSchema(projects!,uiSchema, schema)
        var currentProject = await ADOAPI.getCurrentProject()
        console.log(`loaded current project: ${JSON.stringify(currentProject!)}`) 
        await updateCurrentProjectIntoFormData(currentProject!,uiSchema, formData!)
        console.log(`returning formData: ${JSON.stringify(formData)}`) 
        return formData
    } catch (e) {
        console.log(e);
    }    

}

const updateIdentitiesIntoFormData = (uiSchema:{}, formData:any, currentUser:GraphUser) =>
{
    // loop through widgets to see which are customWidgets to set formData before loading
        // const widgetKeys = Object.keys(this.uiSchema!);
    ["currentIdentityWidget","currentIdentitiesWidget","currentUserName", "currentUserEmail" ].forEach( element=> {
        const widgetKeys = recFind.findNestedObject(uiSchema!,"ui:widget",element)
        //console.log(`widgetKeys for ${element}: ${JSON.stringify(widgetKeys)}`)

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
        //console.log(`formData b: ${JSON.stringify(formData!)}`)
    })
}

const updateProjectsIntoSchema = (projects:TeamProjectReference[], uiSchema:{}, schema:JSONSchema7) =>
{
    const widgetKeys = recFind.findNestedObject(uiSchema!,"ui:widget","currentProject")
        //console.log(`widgetKeys for Projects: ${JSON.stringify(widgetKeys)}`)
        //console.log(`projects: ${JSON.stringify(projects)}`)
        var names = projects!.map((item)=>{ return item.name});
        //console.log(`names: ${JSON.stringify(names)}`)

        var widget:string = "currentProject"
        widgetKeys.forEach(element => {
                let ob:any = schema["properties"]
                element.forEach((subelement, idx, array) => {
                    //console.log(`ob : ${JSON.stringify(ob[subelement])} ${subelement} idx: ${idx}`)
                    if (idx === array.length - 1){ 
                        //console.log(`ob : ${JSON.stringify(ob[subelement])} ${subelement} idx: ${idx}`)
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

const updateCurrentProjectIntoFormData = (project:IProjectInfo, uiSchema:{}, formData:any) =>
{
    const widgetKeys = recFind.findNestedObject(uiSchema!,"ui:widget","currentProject")
        // console.log(`widgetKeys for currentProject: ${JSON.stringify(widgetKeys)}`)
        // console.log(`project: ${JSON.stringify(project.name)}`)
        // console.log(`formData: ${JSON.stringify(formData)}`)

        widgetKeys.forEach(element => {
                let ob:any = formData
                element.forEach((subelement, idx, array) => {
                    //console.log(`ob : ${JSON.stringify(ob[subelement])} ${subelement} ${subelement in ob} idx: ${idx} ${array.length - 1}`)
                    if (idx === array.length - 1){ 
                        //console.log(`ob : ${JSON.stringify(ob[subelement])} ${subelement} idx: ${idx}`)
                        ob[subelement] = project.name
                    }
                    else{
                        if(!(subelement in ob))
                        {
                            ob[subelement] = {}
                        }
                        ob = ob[subelement]
                    }
                    //console.log(`ob : ${JSON.stringify(ob[subelement])} ${subelement} ${subelement in ob} idx: ${idx} ${array.length - 1}`)
                });  
        })
        //console.log(`formData: ${JSON.stringify(formData)}`)
}