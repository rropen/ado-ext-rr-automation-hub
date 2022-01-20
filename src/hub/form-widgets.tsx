import * as React from "react";

import {Widgets} from "@rjsf/bootstrap-4";
import {
    IdentitiesPickerHook, 
    IdentityPickerHook
} from "./custom-widgets"




const IdentityWidget = (props:any) => {
    console.log(`IdentityWidget props: ${JSON.stringify(props.value)}`)
    return (
        <IdentityPickerHook formProps={props}/>
    );
}; 

const CurrentIdentityWidget = (props:any) => {
    console.log(`CurrentIdentityWidget props: ${JSON.stringify(props.value)}`)
    return (
        <IdentityPickerHook formProps={props} useCurrentUser={true} />
    );
}; 

const IdentitiesWidget = (props:any) => {
    console.log(`IdentitiesWidget props: ${JSON.stringify(props.value)}`)
    return (
        <IdentitiesPickerHook formProps={props}/>
    );
}; 

const CurrentIdentitiesWidget = (props:any) => {
    console.log(`CurrentIdentitiesWidget props: ${JSON.stringify(props.value)}`)
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