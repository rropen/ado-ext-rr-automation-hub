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
    pipelineIDNames: IListBoxItem[]
}



export class PipelineSelect extends React.Component<PipelineSelectProps> {

    // private buildDefsIDName: IListBoxItem[] = [];

    // we need an item provider that can conform to the IListboxItem (we'll only use ID and text)
    private itemProvider:ObservableValue<ArrayItemProvider<IListBoxItem>>

    constructor(props: PipelineSelectProps) {
        super(props);
        this.itemProvider = new ObservableValue<ArrayItemProvider<IListBoxItem>>(
            new ArrayItemProvider(props.pipelineIDNames)
        );
    }  
    
    componentDidMount() {
    }
    
    render(): JSX.Element { 
        return (
            <CustomHeader className="bolt-header-with-commandbar">
                    <HeaderTitleArea>
                        <HeaderTitleRow>
                            <HeaderTitle ariaLevel={3} className="text-ellipsis" titleSize={TitleSize.Small}>
                                <Observer itemProvider = {this.itemProvider}>
                                    
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