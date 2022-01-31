# Summary

Extension adds a high level Hub page that:
- Allows a user to select a a pipeline containing a JSON schema that defines variables
- Renders a HTML Form using rjsf, that includes validation of fields
- A number of Azure DevOps specific widgets are mapped (Identity pickers, current user, current project)
- Once the form is filled out, the associated pipeline is run by passing the JSON variales to the pipeline variables 
- The pipeline variables are presented as a flattened JSON key-value object, e.g. `"contact.address.street_name" : "main street"` 

# User Guide

Please see [here](./src/user-guide.md)
