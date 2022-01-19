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

//LOCAL
import {PipelineSelect} from "./pipelineSelect"

class Classifier extends React.Component<{}, {}> {

    private buildDefsIDName: IListBoxItem[] = [];

    constructor(props: {}) {
        super(props);
    }  
    
    componentDidMount() {
        SDK.init(
            {loaded: false}
        ).then(async() => {
            console.log("SDK init finished")
            SDK.notifyLoadSucceeded();
        })
    }
    
    render(): JSX.Element { 
        return (
            <Page className="flex-grow">
            {/* <div>
            <div>some text233</div>
            <Dialog titleProps={{ text: "Classifier" }} onDismiss={()=>{}}>
            <div>some text</div>
            </Dialog>
            </div> */}
            
                <PipelineSelect 
                onSelect={this.onSelectBuildDefinition} 
                pipelineIDNames={this.buildDefsIDName} 
                />
            </Page>
        )
    }

    private onSelectBuildDefinition = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>) => {
        // this.selectedBuild! = item;
        console.log(`Selected Build ID: ${item.id} Text: ${item.text}`)
        
        // this.adoApi.getSchemaFilesFromBuild(parseInt(this.selectedBuild!.id)).then((value:[string,string] | undefined) =>{
        //     this.schema = JSON.parse(value![0])
        //     this.uiSchema = JSON.parse(value![1])
        //     this.loadForm(this.schema!, this.uiSchema!);
        //     console.log(`schema ${JSON.stringify(this.schema!)}`)
        //     console.log(`UIschema ${JSON.stringify(this.uiSchema!)}`)
        // })
        // this.setState({submitted:false})
    };
}

ReactDOM.render(<Classifier />, document.getElementById("root"));
