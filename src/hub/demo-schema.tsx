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

