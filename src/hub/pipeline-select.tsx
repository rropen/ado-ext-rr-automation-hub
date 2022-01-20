import * as React from "react";
import * as ReactDOM from "react-dom";

import { Dropdown } from "azure-devops-ui/Dropdown";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Observer } from "azure-devops-ui/Observer";
import {
    CustomHeader,
    HeaderTitle,
    HeaderTitleArea,
    HeaderTitleRow,
    TitleSize
} from "azure-devops-ui/Header";
import { HeaderCommandBar } from "azure-devops-ui/HeaderCommandBar";
import { TextField } from "azure-devops-ui/TextField";
import { Button } from "azure-devops-ui/Button";
import { getCommandBar } from "./header-data";


export interface PipelineSelectProps {
    onSelect: (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>)  => any
    showSettings: ()  => any
    pipelineIDNames: ObservableValue<ArrayItemProvider<IListBoxItem>>
}

interface PipelineSelectPropsState {
    showSettingsPanel: boolean;
    projectName: string;
}

export class PipelineSelect extends React.Component<PipelineSelectProps,PipelineSelectPropsState> {
    constructor(props: PipelineSelectProps) {
        super(props);
        this.state = { showSettingsPanel: false, projectName: "MarcTest" };
    }  
    
    componentDidMount() {
    }
    
    render(): JSX.Element { 
        return (
            <div>
            <CustomHeader className="bolt-header-with-commandbar">
                    <HeaderTitleArea>
                        <HeaderTitleRow>
                            <HeaderTitle ariaLevel={3} className="text-ellipsis" titleSize={TitleSize.Small}>
                                <Observer itemProvider = {this.props.pipelineIDNames}>
                                    
                                {(observableProps: {
                                        /** itemProvider type declaration */
                                        itemProvider: ArrayItemProvider<IListBoxItem>
                                }) => (
                                <Dropdown
                                ariaLabel="Basic"
                                className="example-dropdown"
                                placeholder="Select Automation"
                                items = {observableProps.itemProvider}
                                onSelect={this.props.onSelect}
                                    />
                                )}
                            </Observer>
                            </HeaderTitle>
                        </HeaderTitleRow>
                    </HeaderTitleArea>
                    <HeaderCommandBar items={getCommandBar( this.props.showSettings)}
                        // () => {
                        // this.setState({showSettingsPanel:true})
                        // console.log("setting state to true")
                        // })} 
                        />
                </CustomHeader>

                </div>
                
        )
    }
}