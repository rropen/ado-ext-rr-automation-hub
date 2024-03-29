export const simpleSchema = `{
    "title": "My Pipeline Variables",
    "type": "object",
    "properties": {
        "users": {
            "type": "object",
            "required": ["user_one","user_two"],
            "properties": {
                "user_one": {
                    "type": "string",
                    "title": "some user"
                },
                "user_two": {
                    "title": "some user 2",
                    "type": "string"
                }
            }
        },
        "repo_details":{
          "type": "object",
          "properties": {
            "repo_in_current":
            {
              "type":"string",
              "title": "current project repo name"
            },
            "all_repos":
            {
              "type":"string",
              "title": "all repo name"
            }
          }
      }
    }
}`

export const simpleUiSchema = `{
    "users": {
        "user_one": {
                "ui:widget": "currentIdentitiesWidget"
                },
        "user_two": {
                "ui:widget": "currentIdentityWidget"
                }
        },
     "repo_details":{
        "repo_in_current":{
            "ui:widget": "reposInCurrentProject"
        },
        "all_repos":{
            "ui:widget": "repos"
        }
     }  
}`

export const simpleUiSchemaSecret:string = `{
    "users": {
        "user_one": {
                "ui:widget": "currentIdentityWidget"
                },
        "user_two": {
                "ui:widget": "identityWidget",
                "ui:secret": true
                }
        }
}`

export const urlStringSchema:string = `{
    "title": "My Pipeline Variables www.google.com",
    "type": "object",
    "properties": {
        "users": {
            "type": "object",
            "title": "users www.google.com",
            "properties": {
                "user_one": {
                    "type": "string",
                    "title": "u1 www.google.com"
                },
                "user_two": {
                    "type": "string",
                    "title": "u2 www.google.com"
                },
                "user_CB": {
                    "type": "boolean",
                    "title": "some boolean www.google.com"
                }
            }
        },
        "user_location": {
            "type": "string",
            "title": "Location www.google.com",
            "default": "GBR",
            "oneOf": [
              {
                "type": "string",
                "title": "United Kingdom",
                "enum": [
                  "GBR"
                ]
              },
              {
                "type": "string",
                "title": "United States",
                "enum": [
                  "USA"
                ]
              }
            ]
          },
          "user_location2": {
            "type": "string",
            "title": "Location www.google.com",
            "default": "GBR",
            "anyOf": [
              {
                "type": "string",
                "title": "United Kingdom",
                "enum": [
                  "GBR"
                ]
              },
              {
                "type": "string",
                "title": "United States",
                "enum": [
                  "USA"
                ]
              }
            ]
          }

    }
    
}`