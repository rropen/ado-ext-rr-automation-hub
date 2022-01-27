import * as React from "react";
import { CodeBlock, googlecode,dracula } from "react-code-blocks";

import { ObservableValue } from "azure-devops-ui/Core/Observable";

import { ISimpleListCell } from "azure-devops-ui/List";
import { Link } from "azure-devops-ui/Link";
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

import * as SimpleSchema from "./demo-schema"

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
        this.schemaCodeUIHelp1 = SimpleSchema.simpleSchema
        this.schemaCodeUIHelp2 = SimpleSchema.simpleUiSchema
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

                <h6> Reference Schemas (<code>$ref</code>)  </h6>

                <p>The extensions supports referencing schemas from other git repositories:</p>

                <CodeBlock
                text={`
                "some_reference_object": {
                    "type": "object",
                    "title": "Some Title",
                    "properties": {
                        "$ref": <url> 
                    }
                  }       
`}
                language="json"
                showLineNumbers={false}
                startingLineNumber={1}
                theme={this.theme}
                />
                <p></p>
                <p>To refrence a Git repo, substitute the <code>url</code> for:</p> 
                <p><code>{"https://dev.azure.com/<org>/<project>/_apis/git/repositories/ <reponame>/items?path=<schema filename>&api-version=6.0"}</code></p>
                <p>This uses the API described <Link href="https://docs.microsoft.com/en-us/rest/api/azure/devops/git/items/get?view=azure-devops-rest-6.0">here</Link>. This includes options for specifying the version/branch/commit ids</p>
                    
                
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

                <p><code>identityWidget</code> - An empty single Azure DevOps identity picker (user or group). The Display Name of the identity is used to populate the form.</p>
                <p><code>currentIdentityWidget</code> - A single Azure DevOps identity picker (user or group) populated with the current user. A CSV of the Display Names of the identities are used to populate the form</p>
                <p><code>identitiesWidget</code> - A multiple Azure DevOps identity picker (users or groups). The Display Name of the identity is used to populate the form. </p>
                <p><code>currentIdentitiesWidget</code> - A multiple Azure DevOps identity picker (users or groups) populated with the current user. A CSV of the Display Names of the identities are used to populate the form</p>
                <p><code>currentUserName</code> - A text entry populated with the current users display name</p>
                <p><code>currentUserEmail</code> - A text entry populated with the current users email</p>
                <p><code>currentProject</code> - A text entry populated with the current project</p>


                <h6> Secret Variables  </h6>

                <p> Secret variables can be defined such that once submitted, they will not appear in any pipeline output or API calls. To do this, use the <code>"ui:secret": true</code> tag in the UI Schema file: </p>
                
                
                <CodeBlock
                text={SimpleSchema.simpleUiSchemaSecret}
                language="json"
                showLineNumbers={false}
                startingLineNumber={1}
                theme={this.theme}
                />

                <p>In the above, User Two will be passed a secret variable to the pipeline.</p>

            </div>

            <div>
                <h5> Support </h5>
                <p> For additional support, please contact your Azure DevOps admin(s) </p>
            </div>
            </div>
        )
    }
}
