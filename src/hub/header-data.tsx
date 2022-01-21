import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { MenuItemType } from "azure-devops-ui/Menu";

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