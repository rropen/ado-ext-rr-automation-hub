##### About

This extension provides a simplified means of running pipelines. It does this by auto-generating a UI from a JSONSchema stored alongside the pipeline yaml file. For additional support, please contact your Azure DevOps admin(s) 

#####  Settings 
               
###### Project Name

Name of project to load pipelines from.

###### Branch Name

Name of the branch of the associated git repo to execute the pipeline

###### Schema File Name

Name of the file containing the JSON schema defining the pipeline variables. Default is `azure-pipelines-variable-schema.json`

The variables are flattened when passed to the pipeline. So the below:

```json
{
    "a": {
        "b": {
            "c": "hello"
        }
    }
}
```

Becomes the following as a pipeline variable: 

```json
{"a.b.c": "hello"}
```

###### Reference Schemas (`$ref`)

This extension supports referencing schemas from other git repositories:

```json
"some_reference_object": {
   "type": "object",
   "title": "Some Title",
   "properties": {
      "$ref": <url> 
      }
   }       
}
```
To refrence a Git repo, substitute the `<url>` for:

`https://dev.azure.com/<org>/<project>/_apis/git/repositories/ <reponame>/items?path=<schema filename>&api-version=6.0"`

This uses the API described [here]("https://docs.microsoft.com/en-us/rest/api/azure/devops/git/items/get?view=azure-devops-rest-6.0"). This includes options for specifying the version/branch/commit ids.


###### UI Schema File Name

The auto-generatd UI can be customised using a separate JSON file. This setting defines this file and the default is `azure-pipelines-variable-schema-ui.json`

The format of this file follows the heirarchy of the associated JSON schema.

Given the JSONSchema:

```json
{
   "title": "My Pipeline Variables",
   "type": "object",
   "properties": {
      "users": {
         "type": "object",
         "properties": {
               "user_one": {
                  "type": "string"
               },
               "user_two": {
                  "type": "string"
               }
         }
      }
   }
}
```
And the provided UI schema:

```json
{
    "users": {
        "user_one": {
                "ui:widget": "currentIdentityWidget"
                },
        "user_two": {
                "ui:widget": "identityWidget"
                }
        }
}
```

The resultant auto-generated UI will include two Azure DevOps Identity Pickers, with one populated with the current user.

The `ui:widget` element can be set to:

- `identityWidget`: An empty single Azure DevOps identity picker (user or group). The Display Name of the identity is used to populate the form.
- `currentIdentityWidget`: A single Azure DevOps identity picker (user or group) populated with the current user. A CSV of the Display Names of the identities are used to populate the form
- `identitiesWidget`: A multiple Azure DevOps identity picker (users or groups). The Display Name of the identity is used to populate the form. 
- `currentIdentitiesWidget`: A multiple Azure DevOps identity picker (users or groups) populated with the current user. A CSV of the Display Names of the identities are used to populate the form
- `currentUserName`: A text entry populated with the current users display name
- `currentUserEmail`: A text entry populated with the current users email
- `currentUserLoginEmail`: A text entry populated with the current users login email (could be different to the mail address)
- `currentProject`: A text entry populated with the current project


###### Secret Variables   

 Secret variables can be defined such that once submitted, they will not appear in any pipeline output or API calls. To do this, use the `"ui:secret": true` tag in the UI Schema file: 

```json
{
    "users": {
        "user_one": {
                "ui:widget": "currentIdentityWidget"
                },
        "user_two": {
                "ui:widget": "identityWidget",
                "ui:secret": true
                }
        }
}
```

In the above, `User Two` will be passed a secret variable to the pipeline.
