export const simpleSchema = `{
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
}`

export const simpleUiSchema = `{
    "users": {
        "user_one": {
                "ui:widget": "currentIdentityWidget"
                },
        "user_two": {
                "ui:widget": "identityWidget"
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