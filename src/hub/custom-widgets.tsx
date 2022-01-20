import * as React from "react";

import { ObservableValue,ObservableArray } from "azure-devops-ui/Core/Observable";

import {
    IdentityPicker,
    IIdentity,
    IdentityPickerDropdown
} from "azure-devops-ui/IdentityPicker";

import {PeoplePickerProvider} from "@byndit/azure-devops-extension-api/Identities";

import * as ADOAPI from "./ado-api";

// field we use for filling in the form for a given identity
const getIdentityField = (id:IIdentity) => `'${id.displayName}'`

export interface IdentityPickerHookProps {
    formProps: any,
    useCurrentUser?: boolean
}

export class IdentityPickerHook extends React.Component<IdentityPickerHookProps> {

    static defaultProps = {
        useCurrentUser: false
    }
    private pickerProvider = new PeoplePickerProvider();
    private selectedIdentity = new ObservableValue<IIdentity | undefined>(undefined);
    // private adoAPI:AdoApi = new AdoApi({});

    constructor(props: IdentityPickerHookProps) {
        super(props);
        console.log(`props ${JSON.stringify(props)}`)
        console.log(`useCurrentUser ${JSON.stringify(props.useCurrentUser)}`)
        if(props.useCurrentUser){
            console.log("creating identity picker with current user")
            ADOAPI.getCurrentIdentityUser().then( (value) => {
                this.onChange(value!)
            })
        }
    }

        public render() {
        return (
            <div>
            <label className="form-label">{this.props.formProps.schema.title}</label>
            <div className="identity-picker-container">
            <IdentityPickerDropdown
                onChange={this.onChange}
                pickerProvider={this.pickerProvider}
                value={this.selectedIdentity}
            />
            </div>
            </div>
        );
    }

    private onChange = (identity?: IIdentity) => {
        this.selectedIdentity!.value = identity;
        this.updateFormProps();
    };
    private updateFormProps()
    {
        // csv of users mails for now
        var strRep
        if (this.selectedIdentity!== undefined && this.selectedIdentity.value!== undefined ){
            strRep = getIdentityField(this.selectedIdentity!.value!)

        }
        else{
            strRep=""
        }
        this.props.formProps.onChange(strRep)
    }
}

export class IdentitiesPickerHook extends React.Component<IdentityPickerHookProps> {

    static defaultProps = {
        useCurrentUser: false
    }

    private pickerProvider = new PeoplePickerProvider();
    private selectedIdentities = new ObservableArray<IIdentity>([]);
    // private adoAPI:AdoApi = new AdoApi({});

    constructor(props: IdentityPickerHookProps) {
        super(props);
        console.log(`props ${JSON.stringify(props)}`)
        console.log(`useCurrentUser ${JSON.stringify(props.useCurrentUser)}`)
        if(props.useCurrentUser){
            console.log("creating identity picker with current user")
            ADOAPI.getCurrentIdentityUser().then( (value) => {
                this.onIdentityAdded(value!)
            })
        }
    }

    public render(): JSX.Element {
        return (
            <div>
            <label className="form-label">{this.props.formProps.schema.title}</label>
            <div className="identity-picker-container">
            <IdentityPicker             
                onIdentitiesRemoved={this.onIdentitiesRemoved}
                onIdentityAdded={this.onIdentityAdded}
                onIdentityRemoved={this.onIdentityRemoved}
                pickerProvider={this.pickerProvider}
                selectedIdentities={this.selectedIdentities}
                
            />
            </div>
            </div>
        ) 
        }  

    private onIdentitiesRemoved = (identities: IIdentity[]) => {
        console.log(
            `Identity Removed: ${identities.map((identity) => identity.displayName).join(", ")}`
        );
        

        this.selectedIdentities.value = this.selectedIdentities.value.filter(
            (entity: IIdentity) =>
                identities.filter((item) => item.entityId === entity.entityId).length === 0
        );
        this.updateFormProps();
    };

    private onIdentityAdded = (identity: IIdentity) => {
        console.log(`Identity Added: ${identity.displayName}`);
        console.log(`Identity Added: ${JSON.stringify(identity)}`)
        this.selectedIdentities.push(identity);
        this.updateFormProps();
    };

    private onIdentityRemoved = (identity: IIdentity) => {
        console.log(`Identity Added: ${identity.displayName}`);
        this.selectedIdentities.value = this.selectedIdentities.value.filter(
            (entity: IIdentity) => entity.entityId !== identity.entityId
        );
        this.updateFormProps();
    };

    private updateFormProps()
    {
        // csv of users mails for now
        let strRep = this.selectedIdentities.value.map((a) => ( getIdentityField(a) )).join(",")
        this.props.formProps.onChange(strRep)
    }
}