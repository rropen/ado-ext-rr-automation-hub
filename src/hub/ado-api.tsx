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


// may want to be a class if the getClient takes a while and does not cache anywhere... 

/**
 * Get build definitions. Returns promise with list of defs if successful 
 * @param {any} data object 
 * @param {string} c key to pass per recursion
 * @returns {Promise<BuildDefinitionReference[] | undefined>}
 */
export const getBuildDefinitions = async () : Promise<BuildDefinitionReference[] | undefined> =>
{
    try{
        ;
        var buildDefs:BuildDefinitionReference[] = await getClient(BuildRestClient).getDefinitions("MarcTest")
        console.log(`Builds: ${JSON.stringify(buildDefs)}`)  
        return buildDefs      
    } catch (e) {
        console.log(e);

    }
}

export const getSchemaFilesFromBuild = async (buildDefID: number): Promise<[string,string] | undefined> =>
{ 
    try{
        var build:BuildDefinition
        build = await getClient(BuildRestClient).getDefinition("MarcTest",buildDefID)
        //build.
        console.log(`repository for build: ${JSON.stringify(buildDefID)} ${JSON.stringify(build.repository)}`)  
        
        var gitClient:GitRestClient = getClient(GitRestClient);
        var repo:GitRepository
        repo = await gitClient.getRepository(build.repository.id)
        console.log(`git repository for build: ${JSON.stringify(repo)}`)  

        var version:GitVersionDescriptor = {
            version: "main",
            versionType:  GitVersionType.Branch ,
            versionOptions: GitVersionOptions.None
        }
        
        var tprops = {
            repositoryId:repo.id,
            path:"azure-pipelines-variable-schema.json",
            versionDescriptor:version
        }

        var content:ArrayBuffer = await gitClient.getItemContent(tprops.repositoryId,tprops.path,"MarcTest","",VersionControlRecursionType.None,false,false,false,tprops.versionDescriptor)
        var schemaString:string = new TextDecoder().decode(content)
        console.log(`content: ${JSON.stringify(schemaString)}`)  

        var tprops = {
            repositoryId:repo.id,
            path:"azure-pipelines-variable-schema-ui.json",
            versionDescriptor:version
        }

        var content:ArrayBuffer = await gitClient.getItemContent(tprops.repositoryId,tprops.path,"MarcTest","",VersionControlRecursionType.None,false,false,false,tprops.versionDescriptor)
        var UIschemaString:string = new TextDecoder().decode(content)
        console.log(`content: ${JSON.stringify(UIschemaString)}`)  

        return [schemaString,UIschemaString]      

    } catch (e) {
        console.log(e);

    }
}

