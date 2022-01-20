import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { MenuItemType } from "azure-devops-ui/Menu";

// export const commandBar():

export const getCommandBar = (onActivate:()=>any) : IHeaderCommandBarItem[] => {

    return ([
    {
        
        iconProps: {
            iconName: "CheckMark"
        },
        id: "settings",
        important: true,
        onActivate: onActivate,
        text: "Settings"
    }
    ])
}