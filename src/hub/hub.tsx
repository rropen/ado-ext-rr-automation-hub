import "./hub.scss";
// import "../../node_modules/bootstrap3/dist/css/bootstrap.css";
// import '../../node_modules/bootstrap/dist/css/bootstrap.css';

import * as React from "react";
import * as ReactDOM from "react-dom";
//SDK
import * as SDK from "azure-devops-extension-sdk";

//UI
import { Dialog } from "azure-devops-ui/Dialog";
import { Page } from "azure-devops-ui/Page";  
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ObservableValue } from "azure-devops-ui/Core/Observable";

//LOCAL
import {PipelineSelect} from "./pipelineSelect"
import * as ADOAPI from "./ado-api"

class Classifier extends React.Component<{}, {}> {

    // private buildDefsIDName: ArrayItemProvider<IListBoxItem>;
    private buildDefsItemProvider = new ObservableValue<ArrayItemProvider<IListBoxItem>>(
        new ArrayItemProvider([])
    )

    constructor(props: {}) {

        super(props);
    }  
    
    componentDidMount() {
        SDK.init(
            {loaded: false}
        ).then(async() => {

            ADOAPI.getBuildDefinitions().then( (value) => { 
                //transform value to an object that confirms to IListboxItem, so can pass it back to the dropdown
                var buildDefsIDName = value!.map((a) => ({id: a.id.toString(), text: a.name}))
                this.buildDefsItemProvider.value = new ArrayItemProvider(
                    buildDefsIDName
                );
            }) 

            console.log("SDK init finished")
            SDK.notifyLoadSucceeded();
        })
    }
    
    render(): JSX.Element { 
        return (
            <Page className="flex-grow">
                <PipelineSelect 
                onSelect={this.onSelectBuildDefinition} 
                pipelineIDNames={this.buildDefsItemProvider} 
                />
            </Page>
        )
    }

    private onSelectBuildDefinition = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>) => {
        console.log(`Selected Build ID: ${item.id} Text: ${item.text}`)
        
        ADOAPI.getSchemaFilesFromBuild(parseInt(item.id)).then((value:[string,string] | undefined) =>{
            var schema = JSON.parse(value![0])
            var uiSchema = JSON.parse(value![1])
        //     this.loadForm(this.schema!, this.uiSchema!);
            console.log(`schema ${JSON.stringify(schema)}`)
            console.log(`UIschema ${JSON.stringify(uiSchema)}`)
        })
        // this.setState({submitted:false})
    };
}

ReactDOM.render(<Classifier />, document.getElementById("root"));
