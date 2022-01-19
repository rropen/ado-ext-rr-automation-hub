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
import { TextField } from "azure-devops-ui/TextField";
import { Button } from "azure-devops-ui/Button";

export interface PipelineSelectProps {
    onSelect: (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>)  => any
    pipelineIDNames: ObservableValue<ArrayItemProvider<IListBoxItem>>
}


export class PipelineSelect extends React.Component<PipelineSelectProps> {
    constructor(props: PipelineSelectProps) {
        super(props);
    }  
    
    componentDidMount() {
    }
    
    render(): JSX.Element { 
        return (
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
                </CustomHeader>
        )
    }
}