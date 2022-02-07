import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";

export const getCommandBar = (onActivate:()=>any, onHelp:()=>any) : IHeaderCommandBarItem[] => {

    return ([
    {
        iconProps: {
            iconName: "Settings"
        },
        id: "settings",
        important: true,
        onActivate: onActivate,
        text: "Settings"
    },
    {
        iconProps: {
            iconName: "Help"
        },
        id: "help",
        important: true,
        onActivate: onHelp,
        text: "Help"
    }
    ])
}