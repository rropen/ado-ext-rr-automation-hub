import * as React from "react";
import { Panel } from "azure-devops-ui/Panel";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { FormItem } from "azure-devops-ui/FormItem";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";

export interface IPanelExampleState {
    expanded: boolean
    settings: ISettings
}

export interface ISettings {
    projectName: string
    branchName: string
    schemaFileName: string
    uiSchemaFileName: string
}

export interface IPanelExampleProps {
    settings: ISettings
    projectNames: string[]
    onDismiss: () => void 
    onSave: (settings: ISettings) => void
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
        // console.log("Calling on dismiss")
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
                            { text: "Cancel", onClick: this.dismiss },
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

                        {/* <SettingsFormItem 
                            label="Project Name"
                            message="Project containing pipelines"
                            value={this.state.settings.projectName}
                            onChange={(e, val) => {
                                this.setState(prevState  => ({
                                    settings: 
                                        { ...prevState.settings, projectName:val}}
                                        )
                                    )
                            }}    
                        /> */}

                        <SettingsFormItem 
                            label="Branch Name"
                            message = "Name of branch containing pipeline files"
                            value={this.state.settings.branchName}
                            onChange={(e, val) => {
                                this.setState(prevState  => ({
                                    settings: 
                                        { ...prevState.settings, branchName:val}}
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
