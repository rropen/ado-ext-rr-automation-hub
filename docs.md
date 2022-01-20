## to run in dev server:

`npm run start:dev` 

- this will need the `dev` version of the extension to be published and installed in an ADO istance
- can use localhost, but the ADO API calls will not work

## to publish:

`npm run publish:dev -- --token <token>`, token needs to have marketplace publish perms in ADO for all organisations 


# Design 

## React

Hub
|  | Dropdown | |
|  | FormPage | |   
|               |
|               |
| SubmitDialog  |
| ErrorDialog   |


## Non-React

- ado-api
- utils 