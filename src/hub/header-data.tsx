import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";

export const getCommandBar = (onActivate:()=>any, onHelp:()=>any) : IHeaderCommandBarItem[] => {

    return ([
    {
        iconProps: {
            iconName: "Settings"
        },
        id: "settings",
        important: false,
        onActivate: onActivate,
        text: "Settings"
    },
    {
        iconProps: {
            iconName: "Help"
        },
        id: "help",
        important: false,
        onActivate: onHelp,
        text: "Help"
    }
    ])
}