import "./hub.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";
//SDK
import * as SDK from "azure-devops-extension-sdk";
import { JSONSchema7} from 'json-schema';
import $RefParser from "@apidevtools/json-schema-ref-parser";

//UI
import { Dialog } from "azure-devops-ui/Dialog";
import { Page } from "azure-devops-ui/Page";  
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";

//LOCAL
import {PipelineSelect, loadingItem} from "./pipeline-select"
import * as ADOAPI from "./ado-api"
import {ParametersForm} from "./parameters-form"
import {SubmitDialog} from "./submit-dialog"
import {ErrorDialog} from "./error-dialog"
import * as LoadFormData from "./load-form-data"
import * as Flat from "./flatten"
import {SettingsPanel, ISettings} from "./settings-panel"
import {LogError, Logger} from "./logger"
import {urlStringSchema} from "./demo-schema"


interface IHubStateProps {
    showPipelineForm: boolean,
    formData: {}
    schema:JSONSchema7,
    uiSchema: {},
    selectedBuildID: number | undefined,
    submitted: boolean,
    submittedBuildUrl: string | undefined
    showError:boolean,
    errorMsg: string | undefined
    showSettingsPanel:boolean
    settings: ISettings
    projectNames:string[],
    loading: boolean
}

/**
 * Main Hub component. 
 * 
 */
class Hub extends React.Component<{}, IHubStateProps> {

    // observable that monitors changes to the associated ArrayItemProvider
    // setting the .value of the below will re-render associated observers 
    private buildDefsItemProvider = new ObservableValue<ArrayItemProvider<IListBoxItem>>(
        new ArrayItemProvider([])
    )

    constructor(props: {}) {
        super(props);
        this.state = {
            showPipelineForm: false, formData: {}, schema:{}, uiSchema:{}, 
            selectedBuildID:undefined, submittedBuildUrl:undefined, submitted:false,
            showError: false, errorMsg:undefined, showSettingsPanel:false,
            settings: {
                projectName: "", 
                folder: undefined,
                schemaFileName:"azure-pipelines-variable-schema.json",
                uiSchemaFileName:"azure-pipelines-variable-schema-ui.json",
                branchName: "main",
                tagName: undefined
            },
            projectNames:[],
            loading: false
        }
        this.submit = this.submit.bind(this);

    }  
    
    componentDidMount() {
        /// testing
        if(false){
            let schema = JSON.parse(urlStringSchema)
            let uiSchema = {}
            LoadFormData.loadForm(schema, uiSchema).then(value => {
                Logger.debug(`schema ${JSON.stringify(schema)}`)
                Logger.debug(`UIschema ${JSON.stringify(uiSchema)}`)
                this.setState({showPipelineForm:true, formData:value!, schema:schema, uiSchema:uiSchema, loading:false})
                })
        }
        
        SDK.init(
            {loaded: false}
        ).then(async() => {

            try {
                var loadedSettings:ISettings = await ADOAPI.loadSettings()
                this.setState({settings:loadedSettings})
            } catch (e) {
                Logger.debug("could not load settings")
                LogError(e)
            }

            ADOAPI.getCurrentProject().then((value)=>{
                this.setState(prevState  => ({
                    settings: 
                        { ...prevState.settings, projectName:value!.name}}
                        )
                    )
                this.loadBuildDefinitions()
            }
            )    
            
            ADOAPI.getProjects().then((value)=>{
                this.setState({projectNames : Array.from(value!, x => x.name!)});
            })

            // await here rather than then
            // var tp = await ADOAPI.getProjects();
            // this.setState({projectNames : Array.from(tp!, x => x.name!)});
            Logger.debug("SDK init finished")
            SDK.notifyLoadSucceeded();
            


        })
    }

    componentDidUpdate(){
        Logger.debug(`update called ${JSON.stringify(this.state)}`)
        // Logger.debug(`update called ${JSON.stringify(this.state)}`)
    }

    loadBuildDefinitions(){
        this.buildDefsItemProvider.value = new ArrayItemProvider(
            [loadingItem]
        );

        ADOAPI.getBuildDefinitions(this.state.settings.projectName, this.state.settings.folder).then( (value) => { 
            //transform value to an object that confirms to IListboxItem, so can pass it back to the dropdown
            var buildDefsIDName = value!.map((a) => ({id: a.id.toString(), text: a.name}))
            if (buildDefsIDName.length === 0){ 
                var e = {message:`Could not find any pipelines in project ${this.state.settings.projectName}`}
                LogError(e)
                throw (e)
            }
            this.buildDefsItemProvider.value = new ArrayItemProvider(
                buildDefsIDName
            );
        }).catch( (e:any) => {this.setState({errorMsg:e.message, showError:true})});  
    }
    
    render(): JSX.Element { 
        return (
            <Page className="flex-grow">

                
                <PipelineSelect 
                onSelect={this.onSelectBuildDefinition} 
                pipelineIDNames={this.buildDefsItemProvider}
                showSettings={()=>this.setState({showSettingsPanel:true})}
                />
                <div className="page-content page-content-top">
                    
                    { this.state.loading ?  
                    <Dialog titleProps={{text:""}} onDismiss={()=>{}}>
                     <Spinner size={SpinnerSize.large} label="loading" /> 
                    </Dialog>
                    : null }

                    { this.state.showPipelineForm ?  
                        <ParametersForm onSubmit={this.submit} schema={this.state.schema} uiSchema={this.state.uiSchema} formData={this.state.formData} />
                    
                    : null } 
                    
                    { this.state.submitted ? 
                        <SubmitDialog isDialogOpen={true} onClose={()=>{this.setState({submitted:false})}} buildUrl={this.state.submittedBuildUrl!}></SubmitDialog>
                    : null } 

                    { this.state.showError ? 
                     <ErrorDialog isDialogOpen={true} errorMsg={this.state.errorMsg!} onClose={()=>{this.setState({showError:false})}}></ErrorDialog>
                    : null }          

                    { this.state.showSettingsPanel ?             
                        <SettingsPanel settings={this.state.settings} projectNames={this.state.projectNames }
                        onSave={(newSettings) => {
                            Logger.debug(`Saving ${JSON.stringify(newSettings)}`)
                            this.setState({settings:newSettings, showPipelineForm:false},this.loadBuildDefinitions)
                            ADOAPI.saveSettings(newSettings)
                            }  
                        } 
                        onDismiss={()=>this.setState({showSettingsPanel:false})}
                        />  
                     : null }         

                 </div>
                 
            </Page>
        )
    }

    

    private onSelectBuildDefinition = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>) => {
        Logger.debug(`Selected Build ID: ${item.id} Text: ${item.text}`)
        this.setState({selectedBuildID:parseInt(item.id), loading:true, showPipelineForm:false})

        
        ADOAPI.getSchemaFilesFromBuild(parseInt(item.id),
                                       this.state.settings.projectName, 
                                       this.state.settings.schemaFileName,
                                       this.state.settings.uiSchemaFileName,
                                       this.state.settings.branchName,
                                       this.state.settings.tagName).then( async (value:string[] | undefined) =>{
            var schemaRaw:JSONSchema7 = JSON.parse(value![0])
            var schema:any                                
            try {
                Logger.debug(`schemaRaw ${JSON.stringify(schemaRaw)}`);
                var header = await ADOAPI.getAuthorizationHeader();
                schema = await $RefParser.dereference(schemaRaw,{
                    resolve: {
                        file: false,                    // Don't resolve local file references
                        http: {
                          timeout: 5000,                // 2 second timeout
                        //   withCredentials: true,  // Include auth credentials when resolving HTTP references
                          headers :  {Authorization: header },
                          redirects: 10                          
                        },
                        
                }});
                Logger.debug(`schemaOut ${JSON.stringify(schema)}`);
            } catch(err) {
                LogError(err)
                throw err;
            }
            
            var uiSchema = JSON.parse(value![1])
            LoadFormData.loadForm(schema, uiSchema).then(value => {
                Logger.debug(`schema ${JSON.stringify(schema)}`)
                Logger.debug(`UIschema ${JSON.stringify(uiSchema)}`)
                this.setState({showPipelineForm:true, formData:value!, schema:schema, uiSchema:uiSchema, loading:false})
            }).catch( (e:any) => {this.setState({ errorMsg:e.message, showError:true, showPipelineForm:false,  loading:false})});    
        }).catch( (e:any) => {this.setState({errorMsg:e.message, showError:true, showPipelineForm:false,  loading:false})});          
    };

    private getSecrets() : {[key:string]:boolean} {
        var flatSchema = Flat.flatten(this.state.uiSchema,"")
        Logger.debug("flatSchema: ",  JSON.stringify(flatSchema));
        const entries = Object.entries(flatSchema);

        var secrets:{[key:string]:boolean} = {}

        for (let i = 0; i < entries.length; i += 1) {
            const [objectKey, objectValue]  = entries[i];
            if(objectKey.includes("ui:secret")){
                let newKey = objectKey.replace(".ui:secret","")
                let nval:any = entries[i][1]
                secrets[newKey] = nval
            }
        }
        return secrets
    }


    private submit(props:any){
        this.setState({loading:true});
        Logger.debug("Data submitted: ",  JSON.stringify(props.formData));
        Logger.debug("State: ",  JSON.stringify(this.state));
        Logger.debug("Selected Build: ",  JSON.stringify(this.state.selectedBuildID!));
        var params = Flat.flatten(props.formData,"");
        var secrets = this.getSecrets()
        ADOAPI.queueBuild(this.state.selectedBuildID!,params,secrets,this.state.settings.projectName,this.state.settings.branchName, this.state.settings.tagName).then( (url:string | undefined) => {
            // throw({message:"ERRROR!"})
            this.setState({submitted:true, submittedBuildUrl:url, loading:false});
        
    }).catch( (e:any) => {
        this.setState({submitted:false, errorMsg:e.message, showError:true, loading:false})
        Logger.debug("Error ",  JSON.stringify(e.message));
        Logger.debug("State ",  JSON.stringify(this.state));
    });

    }
}

ReactDOM.render(<Hub />, document.getElementById("root"));
