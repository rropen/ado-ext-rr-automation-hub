import "./hub.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";
//SDK
import * as SDK from "azure-devops-extension-sdk";
import { JSONSchema7} from 'json-schema';


//UI
import { Dialog } from "azure-devops-ui/Dialog";
import { Page } from "azure-devops-ui/Page";  
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ObservableValue } from "azure-devops-ui/Core/Observable";

//LOCAL
import {PipelineSelect} from "./pipeline-select"
import * as ADOAPI from "./ado-api"
import {ParametersForm} from "./parameters-form"
import {SubmitDialog} from "./submit-dialog"
import {ErrorDialog} from "./error-dialog"
import * as LoadFormData from "./load-form-data"
import * as Flat from "./flatten"
import {SettingsPanel, ISettings} from "./settings-panel"


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
    projectNames:string[]
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
                schemaFileName:"azure-pipelines-variable-schema.json",
                uiSchemaFileName:"azure-pipelines-variable-schema-ui.json",
                branchName: "main"
            },
            projectNames:[]
        }
        this.submit = this.submit.bind(this);
    }  
    
    componentDidMount() {
        SDK.init(
            {loaded: false}
        ).then(async() => {

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
            console.log("SDK init finished")
            SDK.notifyLoadSucceeded();
        })
    }

    componentDidUpdate(){
        console.log(`update called ${JSON.stringify(this.state)}`)
    }

    loadBuildDefinitions(){
        this.buildDefsItemProvider.value = new ArrayItemProvider([]);

        ADOAPI.getBuildDefinitions(this.state.settings.projectName).then( (value) => { 
            //transform value to an object that confirms to IListboxItem, so can pass it back to the dropdown
            var buildDefsIDName = value!.map((a) => ({id: a.id.toString(), text: a.name}))
            if (buildDefsIDName.length === 0){ 
                throw ({message:`Could not find any pipelines in project ${this.state.settings.projectName}`})
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
                    
                    { this.state.showPipelineForm ?  
                        <ParametersForm onSubmit={this.submit} schema={this.state.schema} uiSchema={this.state.uiSchema} formData={this.state.formData} />
                    : null }

                    { this.state.submitted ? 
                        <SubmitDialog isDialogOpen={true} buildUrl={this.state.submittedBuildUrl!}></SubmitDialog>
                    : null } 

                    { this.state.showError ? 
                     <ErrorDialog isDialogOpen={true} errorMsg={this.state.errorMsg!} onClose={()=>{this.setState({showError:false})}}></ErrorDialog>
                    : null }          

                    { this.state.showSettingsPanel ?             
                        <SettingsPanel settings={this.state.settings} projectNames={this.state.projectNames }
                        onSave={(newSettings) => {
                            this.setState({settings:newSettings, showPipelineForm:false},this.loadBuildDefinitions)
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
        console.log(`Selected Build ID: ${item.id} Text: ${item.text}`)
        this.setState({selectedBuildID:parseInt(item.id)})
        
        ADOAPI.getSchemaFilesFromBuild(parseInt(item.id),
                                       this.state.settings.branchName,
                                       this.state.settings.projectName, 
                                       this.state.settings.schemaFileName,
                                       this.state.settings.uiSchemaFileName).then((value:[string,string] | undefined) =>{
            var schema = JSON.parse(value![0])
            var uiSchema = JSON.parse(value![1])
            LoadFormData.loadForm(schema, uiSchema).then(value => {
                console.log(`schema ${JSON.stringify(schema)}`)
                console.log(`UIschema ${JSON.stringify(uiSchema)}`)
                this.setState({showPipelineForm:true, formData:value!, schema:schema, uiSchema:uiSchema})
            }).catch( (e:any) => {this.setState({ errorMsg:e.message, showError:true, showPipelineForm:false})});    
        }).catch( (e:any) => {this.setState({errorMsg:e.message, showError:true, showPipelineForm:false})});          
    };

    private getSecrets() : {[key:string]:boolean} {
        var flatSchema = Flat.flatten(this.state.uiSchema,"")
        console.log("flatSchema: ",  JSON.stringify(flatSchema));
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
        console.log("Data submitted: ",  JSON.stringify(props.formData));
        console.log("State: ",  JSON.stringify(this.state));
        console.log("Selected Build: ",  JSON.stringify(this.state.selectedBuildID!));

        //formData.formData = {}
        var params = Flat.flatten(props.formData,"");

        var secrets = this.getSecrets()
        
        ADOAPI.queueBuild(this.state.selectedBuildID!,params,secrets,this.state.settings.projectName).then( (url:string | undefined) => {
            // throw({message:"ERRROR!"})
            this.setState({submitted:true, 
                submittedBuildUrl:url
        });
        
    }).catch( (e:any) => {
        this.setState({submitted:false, errorMsg:e.message, showError:true})
        console.log("Error ",  JSON.stringify(e.message));
        console.log("State ",  JSON.stringify(this.state));
    });

    }
}

ReactDOM.render(<Hub />, document.getElementById("root"));
