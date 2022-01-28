import * as React from "react";

import {Widgets} from "@rjsf/bootstrap-4";
import {
    IdentitiesPickerHook, 
    IdentityPickerHook
} from "./custom-widgets"
import {Logger} from "./logger"

const IdentityWidget = (props:any) => {
    Logger.debug(`IdentityWidget props: ${JSON.stringify(props.value)}`)
    return (
        <IdentityPickerHook formProps={props}/>
    );
}; 

const CurrentIdentityWidget = (props:any) => {
    Logger.debug(`CurrentIdentityWidget props: ${JSON.stringify(props.value)}`)
    return (
        <IdentityPickerHook formProps={props} useCurrentUser={true} />
    );
}; 

const IdentitiesWidget = (props:any) => {
    Logger.debug(`IdentitiesWidget props: ${JSON.stringify(props.value)}`)
    return (
        <IdentitiesPickerHook formProps={props}/>
    );
}; 

const CurrentIdentitiesWidget = (props:any) => {
    Logger.debug(`CurrentIdentitiesWidget props: ${JSON.stringify(props.value)}`)
    return (
        <IdentitiesPickerHook formProps={props} useCurrentUser={true} />
    );
};

export const widgets = {
    identityWidget: IdentityWidget,
    currentIdentityWidget: CurrentIdentityWidget,
    identitiesWidget: IdentitiesWidget,
    currentIdentitiesWidget: CurrentIdentitiesWidget,
    currentUserName: Widgets.TextWidget,
    currentUserEmail: Widgets.TextWidget,
    currentProject: Widgets.SelectWidget
}; 