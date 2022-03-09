import * as React from "react";
import { Panel } from "azure-devops-ui/Panel";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { FormItem } from "azure-devops-ui/FormItem";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";

import * as ADOAPI from "./ado-api";
import {Logger, LogError} from "./logger";

export interface IPanelExampleState {
    expanded: boolean
    settings: ISettings
}

export interface ISettings {
    projectName: string
    folder : string | undefined
    branchName: string | undefined
    tagName: string | undefined
    schemaFileName: string
    uiSchemaFileName: string
    id?: string | undefined
    logLevel?: string|undefined
}

export interface IPanelExampleProps {
    settings: ISettings
    projectNames: string[]
    onDismiss: () => void 
    onSave: (settings: ISettings) => void
    onReset: () => void
}

export const getSettingsDefaults = async () : Promise<ISettings> => {

    var defs: ISettings ={
        projectName: "", 
        folder: undefined,
        schemaFileName:"azure-pipelines-variable-schema.json",
        uiSchemaFileName:"azure-pipelines-variable-schema-ui.json",
        branchName: "main",
        tagName: undefined,
        id: "settings",
        logLevel: "debug"
    }
    return defs
}


export class SettingsPanel extends React.Component<IPanelExampleProps, IPanelExampleState> {

    private selection = new DropdownSelection();

    constructor(props: IPanelExampleProps) {
        super(props);
        this.state = { expanded: true, settings: this.props.settings };
        this.dismiss = this.dismiss.bind(this);
        // this.projectNameObservable.value = this.props.settings.projectName
    }

    dismiss(){
        this.setState({ expanded: false })
        // Logger.debug("Calling on dismiss")
        this.props.onDismiss()
    }



    public render(): JSX.Element {
        this.selection.select(this.props.projectNames.findIndex((element) => element === this.state.settings.projectName))
        
        return (
            <div>
                {/* <Button onClick={() => this.setState({ expanded: true })}>Show Panel</Button> */}
                {this.state.expanded && (
                    <Panel
                        onDismiss={this.dismiss}

                        titleProps={{ text: "Automation settings" }}
                        // description={
                        //     "Automation settings"
                        // }
                        footerButtonProps={[
                            { text: "Close", onClick: this.dismiss },
                            { text: "Reset",  onClick: async () =>{ 
                                await this.props.onReset()
                                this.setState({ settings: this.props.settings })
                                } 
                            },
                            { text: "Save", primary: true, onClick: () =>{ 
                                this.dismiss()
                                this.props.onSave(this.state.settings)
                                
                                }
                            }
                        ]}
                    >
                        <div style={{ height: "1200px" }}>

                         {/* {JSON.stringify(this.props.settings)} */}
                        
                         <FormItem
                            label={"Project Name"}
                            message={"Project containing pipelines"}
                            className="settings-form-item"
                            >

                         <Dropdown
                            ariaLabel="Basic"
                            className="example-dropdown"
                            placeholder="Select a Project"
                            items={this.props.projectNames}
                            selection= {this.selection}
                            onSelect={(e, val) => {
                                this.setState(prevState  => ({
                                    settings: 
                                        { ...prevState.settings, projectName:val.text!}}
                                        )
                                    )
                            }} 
                        />
                        </FormItem>

                        <SettingsFormItem 
                            label="Folder Path  (optional)"
                            message = "Name of folder containing pipelines"
                            value={this.state.settings.folder!}
                            onChange={(e, val) => {
                                Logger.debug(`setting folder ${val}`)
                                if(val === ""){
                                    val = undefined
                                }
                                this.setState(prevState  => ({
                                    settings: 
                                        { ...prevState.settings, folder:val}}
                                        )
                                    )
                            }}    
                        />

                        <SettingsFormItem 
                            label="Branch Name"
                            message = "Name of git branch containing pipeline files. Do not define Branch and Tag at the same time"
                            value={this.state.settings.branchName!}
                            onChange={(e, val) => {
                                if(val === ""){
                                    val = undefined
                                }
                                this.setState(prevState  => ({
                                    settings: 
                                        { ...prevState.settings, branchName:val}}
                                        )
                                    )
                            }}    
                        />

                        <SettingsFormItem 
                            label="Tag Name"
                            message = "Name of git tag containing pipeline files. Do not define Branch and Tag at the same time"
                            value={this.state.settings.tagName!}
                            onChange={(e, val) => {
                                
                                if(val === ""){
                                    val = undefined
                                }
                                this.setState(prevState  => ({
                                    settings: 
                                        { ...prevState.settings, tagName:val}}
                                        )
                                    )
                            }}    
                        />

                        <SettingsFormItem 
                            label="Schema File Name"
                            message = "Filename of JSON Schema defining pipeline variables"
                            value={this.state.settings.schemaFileName}
                            onChange={(e, val) => {
                                this.setState(prevState  => ({
                                    settings: 
                                        { ...prevState.settings, schemaFileName:val}}
                                        )
                                    )
                            }}    
                        />

                        <SettingsFormItem 
                            label="UI Schema File Name"
                            message = "Filename of JSON Schema defining any custom UI widgets (e.g. Identity Users/Groups)"
                            value={this.state.settings.uiSchemaFileName}
                            onChange={(e, val) => {
                                this.setState(prevState  => ({
                                    settings: 
                                        { ...prevState.settings, uiSchemaFileName:val}}
                                        )
                                    )
                            }}    
                        />
                         </div>
                    </Panel>
                )}
            </div>
        );
    }
}

interface ISettingsFormItemProps
{
    label: string
    message: string
    value: string
    onChange: (e:any, v:any)=>void 
}

export class SettingsFormItem extends React.Component<ISettingsFormItemProps> {

    constructor(props:any){
        super(props)
    }

    public render(): JSX.Element {
        return (
            
            <FormItem
                label={this.props.label}
                message={this.props.message}
                className="settings-form-item"
                >
                <TextField
                    value={this.props.value}
                    onChange={this.props.onChange}
                    placeholder={this.props.label}
                    width={TextFieldWidth.standard}
                />
            </FormItem>
        )
    }
}
