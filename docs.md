## to run in dev server:

`npm run start:dev` 

- this will need the `dev` version of the extension to be published and installed in an ADO istance
- can use localhost, but the ADO API calls will not work

## to publish:

`npm run publish:dev -- --token <token>`, token needs to have marketplace publish perms in ADO for all organisations 

## TODO

- Wrap promise errors in ADO error prompt? 
- Extension default settings stored somewhere? and settable by admins only
- Use pipeline folders to define automation, add folder to settings 

# Design 

## React

Hub
|  | Dropdown |       |
|  |  | HelpPanel     |  
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
