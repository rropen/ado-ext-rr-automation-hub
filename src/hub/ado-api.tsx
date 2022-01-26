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

import {
    RunPipelineParameters,
    Run,
    PipelineRestClient,
    Variable
} from "@byndit/azure-devops-extension-api/Pipelines";

import { CommonServiceIds, IProjectPageService } from "@byndit/azure-devops-extension-api";
import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces";

import {
    IVssIdentityService, IdentityServiceIds, IIdentity
} from "@byndit/azure-devops-extension-api/Identities";

import * as SDK from "azure-devops-extension-sdk";


// may want to be a class if the getClient takes a while and does not cache anywhere... 

/**
 * Queue pipeline (ADO latest API)
 * */
export const queueBuild = async (buildDefID:number, parameters: {[key:string]:string}, project:string): Promise<string | undefined> =>
{

    try{
        var _params:any ={}
        for (const [key, val] of Object.entries(parameters)) {
            _params[key] = {
                isSecret: false,
                value: val
            }
          }

        var runParms:RunPipelineParameters = 
        {
            variables: _params
        }

        let submitted:Run = await getClient(PipelineRestClient).runPipeline(runParms,buildDefID,project)
        console.log(`submitted run: ${JSON.stringify(submitted)}`)  
        return submitted._links.web.href

    } catch (e) {
        console.log(JSON.stringify(e));
        throw(e)
    }
}


/**
 * Get build definitions. Returns promise with list of defs if successful 
 * @param {any} data object 
 * @param {string} c key to pass per recursion
 * @returns {Promise<BuildDefinitionReference[] | undefined>}
 */
export const getBuildDefinitions = async (project:string) : Promise<BuildDefinitionReference[] | undefined> =>
{
    try{
        var buildDefs:BuildDefinitionReference[] = await getClient(BuildRestClient).getDefinitions(project)
        console.log(`Builds: ${JSON.stringify(buildDefs)}`)  
        return buildDefs      
    } catch (e) {
        console.log(e);
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
        console.log(`Current User: ${JSON.stringify(currentUser)}`)
        //callback(this);
        return currentUser
    } catch (e) {
        console.log(e);
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
        console.log(`projects: ${JSON.stringify(projects)}`)  
        return projects     
    } catch (e) {
        console.log(e);
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
        console.log(`project: ${JSON.stringify(project)}`)  
        return project     
    } catch (e) {
        console.log(e);
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
        console.log(`Current User: ${JSON.stringify(currentUser)}`)

        var searchRequest = { 
            query: currentUser.mailAddress,
            identityTypes: ["user","group"],
            operationScopes: ["ims","source"]
            };

        // var self = this;
        var currentIdentity;
        await identityService.then(async function (identityService:any) {
            await identityService.searchIdentitiesAsync(searchRequest.query).then(function ( identities:any) {
                // console.log(`this: ${JSON.stringify(self)}`)
                // console.log(`identities: ${JSON.stringify(identities)}`)
                currentIdentity = identities[0];
                return identities});
            return;
        });
                    
        console.log(`this currentIdentity: ${JSON.stringify(currentIdentity)}`)
        return currentIdentity
    } catch (e) {
        console.log(e);
        throw(e)
    }
}  

/**
 * Get schemas from build. Gets repo from build, then get json files from repos
 * */
export const getSchemaFilesFromBuild = async (buildDefID: number, branch:string, 
                                              project:string, 
                                              schemaFileName:string,
                                              uiSchemaFileName:string ): Promise<[string,string] | undefined> =>
{ 
    try{
        var build:BuildDefinition
        build = await getClient(BuildRestClient).getDefinition(project,buildDefID)
        console.log(`repository for build: ${JSON.stringify(buildDefID)} ${JSON.stringify(build.repository)}`)  
        
        var gitClient:GitRestClient = getClient(GitRestClient);
        var repo:GitRepository
        repo = await gitClient.getRepository(build.repository.id)
        console.log(`git repository for build: ${JSON.stringify(repo)}`)  

        var version:GitVersionDescriptor = {
            version: branch,
            versionType:  GitVersionType.Branch ,
            versionOptions: GitVersionOptions.None
        }
        
        var tprops = {
            repositoryId:repo.id,
            path:schemaFileName,
            versionDescriptor:version
        }

        var content:ArrayBuffer = await gitClient.getItemContent(tprops.repositoryId,tprops.path,project,"",VersionControlRecursionType.None,false,false,false,tprops.versionDescriptor)
        var schemaString:string = new TextDecoder().decode(content)
        console.log(`content: ${JSON.stringify(schemaString)}`)  

        var tprops = {
            repositoryId:repo.id,
            path:uiSchemaFileName,
            versionDescriptor:version
        }

        var UIschemaString:string = "{}"
        try{
        var content:ArrayBuffer = await gitClient.getItemContent(tprops.repositoryId,tprops.path,project,"",VersionControlRecursionType.None,false,false,false,tprops.versionDescriptor)
        UIschemaString = new TextDecoder().decode(content)
        console.log(`content: ${JSON.stringify(UIschemaString)}`)  
        } catch ( e ) {
            if (e instanceof Error){ 
                if (!e.message.includes("could not be found in the repository"))
                {
                    throw e
                }
            }
        }

        return [schemaString,UIschemaString]      

    } catch (e) {
        console.log(e);
        throw(e)

    }
}

