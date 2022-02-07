
# Problem Statement

### Specific 

1. Wider uptake of ADO requires a level of standardisation, simplification and governance 
   - Examples: Creating repositories in a standard way, creating projects/teams, manageing security groups
1. Wider automation of Azure resources could/should be carried out via Infrastructure-as-Code (IaC) executed using pipelines. These pipelines can be tricky to run and hard to access 

### General

1. Running of ADO pipelines can be clunky when setting multiple, complex variables 
1. Common pipelines for general consumption across ADO is difficult (hard to find and execute for beginners)

# Solution 

Create an extension in DevOps that incurs minimal overhead and leverages current pipeline/git features. 

Overview:

- A `JSON` Schema is stored alongside the `YAML` pipeline file
- The schema represents the variables required by the pipeline
- An extensions to DevOps, reads this schema and auto-generates a User Interface for the user enter variables 
- On submit, the extension validates the variables and runs the associated pipeline, passing the variables set 
- A user can monitor the progress using the usual pipeline run UI


## Architecture

![Azure DevOps Architecture](arch.png)

--- 

# Development Docs 

## to run in dev server:

`npm run start:dev` 

- this will need the `dev` version of the extension to be published and installed in an ADO istance
- can use localhost, but the ADO API calls will not work

## to publish:

`npm run publish:dev -- --token <token>`, token needs to have marketplace publish perms in ADO for all organisations 

## TODO

- Deafult settings in a central Git repo, at least defaults 
- Copy vars from previous run 
- No Personal Data (make this explicit)

## DONE

- Change name to 'Self-Service Hub' ? - DONE
- Use pipeline folders to define automation, add folder to settings - DONE
- Extension default settings stored somewhere? and settable by admins only - Done set as user context 'extension docs'

### BUGS

- Switching project in settings doesn't reset the dropdown to include 'Select Automation'. Might be a problem with React's render of the dropdown or the ADO component as the 'Select Automation' disappears when an option is selected. 
- Double clicking checkboxs quickly - might be logging/render callbacks

# Design 

## React

Hub
|  | Dropdown |       |
|  |  |   HelpPanel   |   
|  | FormPage |       |   
|                     |
|                     |
| SubmitDialog        |
| ErrorDialog         |
| SettingsPanel       |


## Non-React

- ado-api
- utils 

# Useful links

- Icons: https://uifabricicons.azurewebsites.net/ 
- https://marketplace.visualstudio.com/manage/publishers/marcrobinsontest
- https://github.com/rjsf-team/react-jsonschema-form
- https://github.com/APIDevTools/json-schema-ref-parser
- https://github.com/byndit/azure-devops-extension-api