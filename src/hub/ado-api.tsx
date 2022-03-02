import { getClient, IProjectInfo } from "@byndit/azure-devops-extension-api/Common";

import {
    BuildRestClient,
    Build,
    BuildDefinitionReference,
    BuildDefinition
} from "@byndit/azure-devops-extension-api/Build";
import {
    GitRepository,
    GitRestClient,
    GitVersionOptions,
    GitVersionType,
    VersionControlRecursionType,
    GitVersionDescriptor,
} from "@byndit/azure-devops-extension-api/Git";

import {
    GraphRestClient,
    GraphUser
} from "@byndit/azure-devops-extension-api/Graph";

import {
    CoreRestClient
} from "@byndit/azure-devops-extension-api/Core";

// import {
//     CoreRestClient
// } from "@byndit/azure-devops-extension-api/Common";

import {
    RunPipelineParameters,
    RunResourcesParameters,
    RepositoryResourceParameters,
    Run,
    PipelineRestClient,
    Variable
} from "@byndit/azure-devops-extension-api/Pipelines";

import { CommonServiceIds, IProjectPageService, IExtensionDataService, IExtensionDataManager, IDocumentOptions, ExtensionDataCollection} from "@byndit/azure-devops-extension-api";
import { TeamProjectReference } from "@byndit/azure-devops-extension-api/Core/Core";
// import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces";

import {
    IVssIdentityService, IdentityServiceIds, IIdentity
} from "@byndit/azure-devops-extension-api/Identities";

import * as SDK from "azure-devops-extension-sdk";
import {IExtensionContext} from "azure-devops-extension-sdk";

import {Logger,LogError} from "./logger"
import {ISettings, getSettingsDefaults} from "./settings-panel"

export const  getAuthorizationHeader = async () => {
    try{
    var token = await SDK.getAccessToken()
        return token ? ("Bearer " + token) : ""; 
    } catch (e) {
        LogError(e)
        throw(e)
    }
}

// may want to be a class if the getClient takes a while and does not cache anywhere... 

const  getExtensionMgr = async ():Promise<IExtensionDataManager> => {
    var context:IExtensionContext = SDK.getExtensionContext()
    var token = await SDK.getAccessToken()
    const dataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
    return dataService.getExtensionDataManager(context.id, token)
}

const getDocCollection = () =>{
    var context:IExtensionContext = SDK.getExtensionContext()
    return context.id
} 

const getDocID = () => {
    return "settings"
}

const settingsExist = async ():Promise<boolean> => {
    var dm:IExtensionDataManager = await getExtensionMgr()
    var opt:IDocumentOptions = {
        scopeType: "User"
    }

    var settingsExist:boolean = false

    // var currentCollections:ExtensionDataCollection[] = await dm.queryCollectionsByName([getDocCollection()])
    try{
    var currentDocs = await dm.getDocuments(getDocCollection(),opt)
    } catch (e) {
        LogError(e)
        return settingsExist
    } 

    currentDocs.forEach(element => {
        if (element.id === getDocID()) settingsExist=true
    })

    Logger.debug(`return settings exists: ${settingsExist}`)
    return settingsExist
}

export const saveSettings = async (settings:ISettings) => {
    var dm:IExtensionDataManager = await getExtensionMgr()
    var context:IExtensionContext = SDK.getExtensionContext()
    var opt:IDocumentOptions = {
        scopeType: "User"
    }

    settings.id = getDocID()
    var exists:boolean = await settingsExist()

    if (!exists){
        try{
            Logger.debug(`creating settings doc`)
            let out = await dm.createDocument(getDocCollection(), settings,opt)
            Logger.debug(`doc created ${JSON.stringify(out)}`)
        } catch (e) {
            LogError(e)
            throw(e)
        }
    }
    else{
        try{
            Logger.debug(`updating settings doc`)
            var doc = await dm.getDocument(getDocCollection(),getDocID(),opt)
            var updated = Object.assign(doc,settings)
            await dm.updateDocument(getDocCollection(),updated,opt)
        } catch (e) {
            LogError(e)
            throw(e)
        }
    }
}

export const deleteAllSettings = async () => {
    var exists:boolean = await settingsExist()

    if(exists){
        var dm:IExtensionDataManager = await getExtensionMgr()
        var context:IExtensionContext = SDK.getExtensionContext()
        var opt:IDocumentOptions = {
            scopeType: "User"
        }
        Logger.debug("deleting document ")
        await dm.deleteDocument(getDocCollection(),getDocID(), opt)
    }
    var exists:boolean = await settingsExist()

    if(exists){
        throw Error("settings detected after reset")
    }
}

export const loadSettings = async ():Promise<ISettings> =>
{
    var dm:IExtensionDataManager = await getExtensionMgr()

    var opt:IDocumentOptions = {
        scopeType: "User"
    }

    try{
        // var set:ISettings = await dm.getDocument(getDocCollection(),"settings",opt)
        if (await settingsExist()){
            var set:ISettings = await dm.getDocument(getDocCollection(),"settings",opt)
            Logger.debug(`loaded setting from collection ${getDocCollection()} ${JSON.stringify(set)}`)
            return set  
        } 
        
        Logger.debug(`did not find saved settings, trying central repo`)
        try{
            var set:ISettings = await loadSettingsFromRepo()
            return set 
        } catch (e) {
            LogError(e)
        }    
        Logger.debug(`could not load settings, using defaults`)
        return getSettingsDefaults()
    } catch (e) {
        LogError(e)
        throw(e)
    }    
}

/**
 * Loading settings from a central repo called `ado-ext-rr-automation-hub-settings` in the current project
 * that contains a `settings.json` file.
 * @returns 
 */
export const loadSettingsFromRepo = async ():Promise<ISettings> =>
{

    try{
        // get defaults from central repo. 
        Logger.debug("loading settings from central repo")
        var project = await getCurrentProject()
        Logger.debug(`loading settings from central repo - project ${project!.name}`)
        var contents = await getFileContentsFromRepo("ado-ext-rr-automation-hub-settings",project!.name,["settings.json"] )
        
        let defs:ISettings = JSON.parse(contents![0])
        Logger.debug(`settings found in central repo: ${JSON.stringify(defs)}`)
        return defs 
        }
    catch (e) {
        Logger.warn("could not load settings from central repo ado-ext-rr-automation-hub-settings")
        LogError(e)
        throw(e)
    }
}

/**
 * Queue pipeline (ADO latest API)
 * */
export const queueBuild = async (buildDefID:number, parameters: {[key:string]:string}, secrets: {[key:string]:boolean}, project:string, branch?:string |undefined, tag?:string|undefined): Promise<string | undefined> =>
{

    try{
        var _params:any ={}
        Logger.debug(`secrets: ${JSON.stringify(secrets)}`)  
        for (const [key, val] of Object.entries(parameters)) {
            _params[key] = {
                isSecret: false,
                value: val
            }
            if (Object.keys(secrets).includes(key) && secrets[key] === true){
                _params[key].isSecret = true
            }
        }

        if (branch !== undefined && tag !== undefined){
            let e = Error(`Cannot define both branch: "${branch}" and tag: "${tag}"`)
            LogError(e)
            throw e            
        }

        var ref: string
        if (branch !== undefined) {ref = branch}
        else if (tag !== undefined) {ref = "refs/tags/"+tag}
        else {ref=""}

        var repoRes:RepositoryResourceParameters = {
            refName: ref,
            token: "",
            tokenType: "",
            version: "",
        }  

        var res:RunResourcesParameters = {
            repositories: {"self": repoRes}
        }

        // res.repositories

        Logger.debug(`_params: ${JSON.stringify(_params)}`)  
        var runParms:RunPipelineParameters = 
        {
            variables: _params,
            resources: res 

        }

        Logger.debug(`submitting: ${JSON.stringify(runParms)}`)  
        let submitted:Run = await getClient(PipelineRestClient).runPipeline(runParms,buildDefID,project)
        Logger.debug(`submitted run: ${JSON.stringify(submitted)}`)  
        return submitted._links.web.href

    } catch (e) {
        LogError(e)
        throw(e)
    }
}


/**
 * Get build definitions. Returns promise with list of defs if successful 
 * @param {any} data object 
 * @param {string} c key to pass per recursion
 * @returns {Promise<BuildDefinitionReference[] | undefined>}
 */
export const getBuildDefinitions = async (project:string, folder?:string|undefined) : Promise<BuildDefinitionReference[] | undefined> =>
{
    try{
        Logger.debug(`folder: ${JSON.stringify(folder)}`)  
        var buildDefs:BuildDefinitionReference[] = await getClient(BuildRestClient).getDefinitions(project,undefined,undefined,undefined,
            undefined,undefined,undefined,undefined,undefined,folder)
        Logger.debug(`Builds: ${JSON.stringify(buildDefs)}`)  
        return buildDefs      
    } catch (e) {
        LogError(e)
        throw(e)
    }
}

/**
 * Get current user. Returns promise with current Graphuser
 * */
export const getCurrentUser = async(): Promise<GraphUser | undefined>=>
{
    try{
        // await delay(15000)
        var currentUser = await getClient(GraphRestClient).getUser(SDK.getUser().descriptor);           
        Logger.debug(`Current User: ${JSON.stringify(currentUser)}`)
        //callback(this);
        return currentUser
    } catch (e) {
        LogError(e)
        throw(e)
    }
}

/**
 * Get all projects. simple wrap of ADO API
 * */
export const  getProjects = async (): Promise<TeamProjectReference[] | undefined> =>
{
    try{
        let projects = await getClient(CoreRestClient).getProjects()
        Logger.debug(`projects: ${JSON.stringify(projects)}`)  
        return projects     
    } catch (e) {
        LogError(e)
        throw(e)

    }
}

/**
 * Get current project. simple wrap of ADO API
 * */
export const getCurrentProject = async (): Promise<IProjectInfo | undefined> =>
{
    try{
        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();
        Logger.debug(`project: ${JSON.stringify(project)}`)  
        return project     
    } catch (e) {
        LogError(e)
        throw(e)

    }
}

/**
 * Get Identity of user. Uses graph to resolve the older Identity objects (needed for pickers etc)
 * */
export const getCurrentIdentityUser = async () : Promise< IIdentity | undefined>  =>
{
    try{
        var identityService = SDK.getService(IdentityServiceIds["IdentityService"]);
        var currentUser = await getClient(GraphRestClient).getUser(SDK.getUser().descriptor);
        
        Logger.debug(`Current User: ${JSON.stringify(currentUser)}`)

        var searchRequest = { 
            query: currentUser.mailAddress,
            identityTypes: ["user","group"],
            operationScopes: ["ims","source"]
            };

        // var self = this;
        var currentIdentity;
        await identityService.then(async function (identityService:any) {
            await identityService.searchIdentitiesAsync(searchRequest.query).then(function ( identities:any) {
                // Logger.debug(`this: ${JSON.stringify(self)}`)
                // Logger.debug(`identities: ${JSON.stringify(identities)}`)
                currentIdentity = identities[0];
                return identities});
            return;
        });
                    
        Logger.debug(`this currentIdentity: ${JSON.stringify(currentIdentity)}`)
        return currentIdentity
    } catch (e) {
        LogError(e)
        throw(e)
    }
}  

export const getFileContentsFromRepo = async (  repoId: string,
                                                project:string, 
                                                fileNames:string[],
                                                branch?:string |undefined, 
                                                tag?:string|undefined ): Promise<string[] | undefined> =>
{
    try
    {
        var gitClient:GitRestClient = getClient(GitRestClient);
        var repo:GitRepository
        repo = await gitClient.getRepository(repoId,project)
        Logger.debug(`git repository for build: ${JSON.stringify(repo)}`)  

        
        var version:GitVersionDescriptor| undefined

        if(branch !== undefined){
            version = {
                version: branch,
                versionType:  GitVersionType.Branch ,
                versionOptions: GitVersionOptions.None
            }
        }
                
        if(tag !== undefined){
            version = {
                version: tag,
                versionType:  GitVersionType.Tag ,
                versionOptions: GitVersionOptions.None
            }
        }
        
        var contentOut:any = []
        for (const fname of fileNames){
            var tprops = {
                repositoryId:repo.id,
                path:fname,            
                versionDescriptor:version
            }
    
            var content:ArrayBuffer = await gitClient.getItemContent(tprops.repositoryId,tprops.path,project,"",VersionControlRecursionType.None,false,false,false,tprops.versionDescriptor)
            var contentString:string = new TextDecoder().decode(content) 
            Logger.debug(`push content out: ${JSON.stringify(contentString)}`)  
            contentOut.push(contentString)
        }
        
        Logger.debug(`content out: ${JSON.stringify(contentOut)}`)    
        return contentOut
    } catch (e) {
        LogError(e)
        throw(e)
    }
}

/**
 * Get schemas from build. Gets repo from build, then get json files from repos
 * */
export const getSchemaFilesFromBuild = async (buildDefID: number,
                                              project:string, 
                                              schemaFileName:string,
                                              uiSchemaFileName:string,
                                              branch?:string |undefined, 
                                              tag?:string|undefined ): Promise<string[] | undefined> =>
{ 
    try{

        var cc = getClient(CoreRestClient)
        // var ss = cc.
        
        if (branch !== undefined && tag !== undefined){
            let e = Error(`Cannot define both branch: "${branch}" and tag: "${tag}"`)
            LogError(e)
            throw e            
        }

        var build:BuildDefinition
        build = await getClient(BuildRestClient).getDefinition(project,buildDefID)
        Logger.debug(`repository for build: ${JSON.stringify(buildDefID)} ${JSON.stringify(build.repository)}`)  

        return getFileContentsFromRepo(build.repository.id,project,[schemaFileName,uiSchemaFileName], branch, tag)
        
        // var gitClient:GitRestClient = getClient(GitRestClient);
        // var repo:GitRepository
        // repo = await gitClient.getRepository(build.repository.id)
        // Logger.debug(`git repository for build: ${JSON.stringify(repo)}`)  

        
        // var version:GitVersionDescriptor| undefined

        // if(branch !== undefined){
        //     version = {
        //         version: branch,
        //         versionType:  GitVersionType.Branch ,
        //         versionOptions: GitVersionOptions.None
        //     }
        // }

        // if(tag !== undefined){
        //     version = {
        //         version: tag,
        //         versionType:  GitVersionType.Tag ,
        //         versionOptions: GitVersionOptions.None
        //     }
        // }
        
        // var tprops = {
        //     repositoryId:repo.id,
        //     path:schemaFileName,
        //     versionDescriptor:version
        // }

        // var content:ArrayBuffer = await gitClient.getItemContent(tprops.repositoryId,tprops.path,project,"",VersionControlRecursionType.None,false,false,false,tprops.versionDescriptor)
        // var schemaString:string = new TextDecoder().decode(content)
        // Logger.debug(`content: ${JSON.stringify(schemaString)}`)  

        // var tprops = {
        //     repositoryId:repo.id,
        //     path:uiSchemaFileName,
        //     versionDescriptor:version
        // }

        // var UIschemaString:string = "{}"
        // try{
        // var content:ArrayBuffer = await gitClient.getItemContent(tprops.repositoryId,tprops.path,project,"",VersionControlRecursionType.None,false,false,false,tprops.versionDescriptor)
        // UIschemaString = new TextDecoder().decode(content)
        // Logger.debug(`content: ${JSON.stringify(UIschemaString)}`)  
        // } catch ( e ) {
        //     if (e instanceof Error){ 
        //         if (!e.message.includes("could not be found in the repository"))
        //         {
        //             throw e
        //         }
        //     }
        // }
        // return [schemaString,UIschemaString]      

    } catch (e) {
        LogError(e)
        throw(e)

    }
}

