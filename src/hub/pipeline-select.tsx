import * as React from "react";
import * as ReactDOM from "react-dom";

import { Dropdown } from "azure-devops-ui/Dropdown";
import { IListBoxItem,LoadingCell,ListBoxItemType  } from "azure-devops-ui/ListBox";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { GroupedItemProvider } from "azure-devops-ui/Utilities/GroupedItemProvider";
import { ITableColumn } from "azure-devops-ui/Table";
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
import { Panel } from "azure-devops-ui/Panel";

import { getCommandBar } from "./header-data";
import { HelpContent } from "./help-panel";


export interface PipelineSelectProps {
    onSelect: (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>)  => any
    showSettings: ()  => any
    pipelineIDNames: ObservableValue<ArrayItemProvider<IListBoxItem>>
}

interface PipelineSelectPropsState {
    showHelpPanel: boolean;
}

export const loadingItem: IListBoxItem = {
    id: "loading",
    type: ListBoxItemType.Loading,
    render: (
        rowIndex: number,
        columnIndex: number,
        tableColumn: ITableColumn<IListBoxItem<{}>>,
        tableItem: IListBoxItem<{}>
    ) => {
        return (
            <LoadingCell
                key={rowIndex}
                columnIndex={columnIndex}
                tableColumn={tableColumn}
                tableItem={tableItem}
                // onMount={this.onLoadingMount}
            />
        );
    }
};


export class PipelineSelect extends React.Component<PipelineSelectProps,PipelineSelectPropsState> {
    private loading = new ObservableValue<boolean>(false);

    constructor(props: PipelineSelectProps) {
        super(props);
        this.state = { showHelpPanel: false };
    }  
    
    componentDidMount() {
    }
    
    render(): JSX.Element { 
        return (
            <div>
                {this.state.showHelpPanel && (
                <Panel
                    onDismiss={() =>{ this.setState({showHelpPanel:false})}}
                    titleProps={{ text: "Help" }}
                >
                <HelpContent />
                </Panel>
            )}

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
                                className="pipeline-select"
                                placeholder="Select Automation"
                                items = {observableProps.itemProvider}
                                loading = {this.loading}
                                onSelect={this.props.onSelect}
                                    />
                                )}
                            </Observer>
                            
                            </HeaderTitle>
                        </HeaderTitleRow>
                    </HeaderTitleArea>
                    <HeaderCommandBar items={getCommandBar( this.props.showSettings, () => {this.setState({showHelpPanel:true})} )}/>
                </CustomHeader>
                </div>
        )
    }
}