import * as React from "react";
import { CodeBlock, googlecode,dracula } from "react-code-blocks";

import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { ISimpleListCell } from "azure-devops-ui/List";
import { MenuItemType } from "azure-devops-ui/Menu";
import { IStatusProps, Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import {
    ColumnMore,
    ColumnSelect,
    Table,
    ISimpleTableCell,
    renderSimpleCell,
    TableColumnLayout,
} from "azure-devops-ui/Table";

import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

// export interface ITableItem extends ISimpleTableCell {
//     name: string;
//     description: string;
// }


    

// export const uiWidetDescriptions: ITableItem[] = [
//     {
//         description: "an empty single Azure DevOps identity (user or group)",
//         name: "identityWidget" ,
//     },
//     {
//         description: "M",
//         name: "Rory Boisvert" ,
//     },
// ];

// export const fixedColumns = [
//     {
//         columnLayout: TableColumnLayout.singleLinePrefix,
//         id: "name",
//         name: "Name",
//         readonly: true,
//         renderCell: renderSimpleCell,
//         width: new ObservableValue(-30),
//     },
//     {
//         id: "description",
//         name: "Description",
//         readonly: true,
//         renderCell: renderSimpleCell,
//         width: new ObservableValue(-80),
//     },
// ];

// export const tableItemsNoIcons = new ArrayItemProvider<ITableItem>(
//     uiWidetDescriptions.map((item: ITableItem) => {
//         const newItem = Object.assign({}, item);
//         // newItem.name = { text: newItem.name.text };
//         return newItem;
//     })
// );

export class HelpContent extends React.Component<any,any> {

    schemaCodeHelp1:string="" 
    schemaCodeHelp2:string=""
    schemaCodeUIHelp1:string="" 
    schemaCodeUIHelp2:string="" 
    theme:any

    constructor(props:any) {
        super(props);
        this.theme = dracula
        this.schemaCodeHelp1 = `{
    "a": {
        "b": {
            "c": "hello"
        }
    }
}`
        this.schemaCodeHelp2 = `{"a.b.c": "hello"}`
        this.schemaCodeUIHelp1 = `{
    "title": "My Pipeline Variables",
    "type": "object",
    "properties": {
        "users": {
            "type": "object",
            "properties": {
                "user_one": {
                    "type": "string",
                }
                "user_two": {
                    "type": "string",
                }
            }
        }
    }
}`

    
        this.schemaCodeUIHelp2 = `{
    "users": {
        "user_one": {
                "ui:widget": "currentIdentityWidget"
                }
        "user_two": {
                "ui:widget": "identityWidget"
                }
        }
}`
    
        }

    render(): JSX.Element {
        return (
            <div>
            <div>
                <h5> About </h5>
                <p> This extension provides a simplified means of running pipelines. It does this by auto-generating a UI from a JSONSchema stored alongside the pipeline yaml file.</p>
            </div>


            <div>
                <h5> Settings </h5>
                <p></p>
                <h6> Project Name </h6>

                <p> Name of project to load pipelines from.  </p>

                <h6> Branch Name </h6>

                <p> Name of the branch of the associated git repo to execute the pipeline </p>

                <h6> Schema File Name </h6>

                <p> Name of the file containing the JSON schema defining the pipeline variables. Default is <code>azure-pipelines-variable-schema.json</code> </p>
                <p>The variables are flattened when passed to the pipeline. So the below </p>

                <CodeBlock
                text={this.schemaCodeHelp1}
                language="json"
                showLineNumbers={false}
                startingLineNumber={1}
                theme={this.theme}
                />

                <p>Becomes the following as a pipeline variable: </p>

                <CodeBlock
                text={this.schemaCodeHelp2}
                language="json"
                showLineNumbers={false}
                startingLineNumber={1}
                theme={this.theme}
                />


                <p></p>

                <h6> UI Schema File Name </h6>

                <p> The auto-generatd UI can be customised using a separate JSON file. This setting defines this file and the default is <code>azure-pipelines-variable-schema-ui.json</code> </p>

                <p> The format of this file follows the heirarchy of the associated JSON schema.</p>
                
                <p>Given the JSONSchema:</p>

                <CodeBlock
                text={this.schemaCodeUIHelp1}
                language="json"
                showLineNumbers={false}
                startingLineNumber={1}
                theme={this.theme}
                />

                <p> And the provided UI schema:</p>

                <CodeBlock
                text={this.schemaCodeUIHelp2}
                language="json"
                showLineNumbers={false}
                startingLineNumber={1}
                theme={this.theme}
                />

                <p> The resultant auto-generated UI will include two Azure DevOps Identity Pickers, with one populated with the current user</p>

                {/* <p> The <code>ui:widget</code> element can be set to: </p> 

                <Table
                    ariaLabel="Basic Table"
                    columns={fixedColumns}
                    itemProvider={tableItemsNoIcons}
                    role="table"
                    className="table-example"
                    containerClassName="h-scroll-auto"
                /> */}

                <p> The <code>ui:widget</code> element can be set to: </p> 

                <p><code>identityWidget</code> - An empty single Azure DevOps identity picker (user or group)</p>
                <p><code>currentIdentityWidget</code> - A single Azure DevOps identity picker (user or group) populated with the current user</p>
                <p><code>identitiesWidget</code> - A multiple Azure DevOps identity picker (users or groups) </p>
                <p><code>currentIdentitiesWidget</code> - A multiple Azure DevOps identity picker (users or groups) populated with the current user</p>
                <p><code>currentUserName</code> - A text entry populated with the current users display name</p>
                <p><code>currentUserEmail</code> - A text entry populated with the current users email</p>
                <p><code>currentProject</code> - A text entry populated with the current project</p>


            </div>

            <div>
                <h5> Support </h5>
                <p> For additional support, please contact your Azure DevOps admin(s) </p>
            </div>
            </div>
        )
    }
}
