import * as React from "react";
import Form from "react-bootstrap/Form";

import { ObservableValue,ObservableArray } from "azure-devops-ui/Core/Observable";

import {
    IdentityPicker,
    IIdentity,
    IdentityPickerDropdown
} from "azure-devops-ui/IdentityPicker";

import {PeoplePickerProvider} from "@byndit/azure-devops-extension-api/Identities";

import * as ADOAPI from "./ado-api";
import {Logger} from "./logger"

// field we use for filling in the form for a given identity
const getIdentityField = (id:IIdentity) => `'${id.subjectDescriptor}'`

export interface IdentityPickerHookProps {
    formProps: any,
    useCurrentUser?: boolean
}

export class IdentityPickerHook extends React.Component<IdentityPickerHookProps> {

    static defaultProps = {
        useCurrentUser: false
    }
    disabled:boolean = false
    private pickerProvider = new PeoplePickerProvider();
    private selectedIdentity = new ObservableValue<IIdentity | undefined>(undefined);
    // private adoAPI:AdoApi = new AdoApi({});

    constructor(props: IdentityPickerHookProps) {
        super(props);
        if(props.formProps.disabled || props.formProps.readonly){
            Logger.debug(`setting disabled true`)
            this.disabled = true
        }

        // Logger.debug(`props ${JSON.stringify(props)}`)
        // Logger.debug(`useCurrentUser ${JSON.stringify(props.useCurrentUser)}`)
        if(props.useCurrentUser){
            // Logger.debug("creating identity picker with current user")
            ADOAPI.getCurrentIdentityUser().then( (value) => {
                this.onChange(value!)
            })
        }
    }

        public render() 
        {
            const {
                // id,
                // placeholder,
                required,
                // readonly,
                // disabled,
                // type,
                label,
                // value,
                // onChange,
                // onBlur,
                // onFocus,
                // autofocus,
                // options,
                schema,
                rawErrors = [],
                uiSchema,
            } = this.props.formProps!;

            // return (
            //     <Form.Group className="mb-0">
            //     <Form.Label className={this.props.formProps.rawErrors.length > 0 ? "text-danger" : ""}>
            //         {this.props.formProps.uiSchema["ui:title"] || this.props.formProps.schema.title || this.props.formProps.label}
            //         {(this.props.formProps.label || this.props.formProps.uiSchema["ui:title"] || this.props.formProps.schema.title) && this.props.formProps.required ? "*" : null}
            //     </Form.Label>
            //     <IdentityPickerDropdown
            //         onChange={this.onChange}
            //         pickerProvider={this.pickerProvider}
            //         value={this.selectedIdentity}
            //         disabled={this.disabled}

            //     />
            //     </Form.Group>
            // );

        return (
            <div>
            <Form.Label className={rawErrors!.length > 0 ? "text-danger" : ""}>
                    {uiSchema["ui:title"] || schema.title || label}
                    {(label || uiSchema["ui:title"] || schema.title) && required ? "*" : null}
            </Form.Label>
            <div className="identity-picker-container" style={this.disabled ? {pointerEvents:'none'}: {}}>
            <IdentityPickerDropdown
                onChange={this.onChange}
                pickerProvider={this.pickerProvider}
                value={this.selectedIdentity}
                disabled={this.disabled}
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
        const {
            options,
        } = this.props.formProps!;
        // must call on change with emptyValue for 'required' to work  
        this.props.formProps.onChange(strRep === "" ? options.emptyValue : strRep)
        
    }
}

export class IdentitiesPickerHook extends React.Component<IdentityPickerHookProps> {

    static defaultProps = {
        useCurrentUser: false
    }

    disabled:boolean = false
    private pickerProvider = new PeoplePickerProvider();
    private selectedIdentities = new ObservableArray<IIdentity>([]);
    // private adoAPI:AdoApi = new AdoApi({});

    
    constructor(props: IdentityPickerHookProps) {
        super(props);
        if(props.formProps.disabled || props.formProps.readonly){
            Logger.debug(`setting disabled true`)
            this.disabled = true
        }
        
        Logger.debug(`props ${JSON.stringify(props)}`)
        Logger.debug(`useCurrentUser ${JSON.stringify(props.useCurrentUser)}`)
        if(props.useCurrentUser){
            Logger.debug("creating identity picker with current user")
            ADOAPI.getCurrentIdentityUser().then( (value) => {
                this.onIdentityAdded(value!)
            })
        }
    }

    public render(): JSX.Element {
            const {
                // id,
                // placeholder,
                required,
                // readonly,
                // disabled,
                // type,
                label,
                // value,
                // onChange,
                // onBlur,
                // onFocus,
                // autofocus,
                // options,
                schema,
                rawErrors = [],
                uiSchema,
            } = this.props.formProps!;
            
            // const inputType = (type || schema.type) === 'string' ?  'text' : `${type || schema.type}`

            // const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
            // onBlur(id, value);
            // const _onFocus = ({
            //     target: { value },
            // }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

            // const _onChange = ({
            //     target: { value },
            //   }: React.ChangeEvent<HTMLInputElement>) =>
            //     onChange(value === "" ? options.emptyValue : value);

            return (
                <Form.Group className="mb-0">

                <Form.Label className={rawErrors!.length > 0 ? "text-danger" : ""}>
                    {uiSchema["ui:title"] || schema.title || label}
                    {(label || uiSchema["ui:title"] || schema.title) && required ? "*" : null}
                </Form.Label>
                {/* <Form.Control
                    id={id}
                    placeholder={placeholder}
                    autoFocus={autofocus}
                    required={required}
                    disabled={disabled}
                    readOnly={readonly}
                    className={rawErrors.length > 0 ? "is-invalid" : ""}
                    list={schema.examples ? `examples_${id}` : undefined}
                    type={inputType}
                    value={value || value === 0 ? value : ""}
                    onChange={_onChange}
                    onBlur={_onBlur}
                    onFocus={_onFocus}
                    hidden={true}

                    /> */}
                    <div className="identity-picker-container" style={this.disabled ? {pointerEvents:'none'}: {}}>
               <IdentityPicker             
                onIdentitiesRemoved={this.onIdentitiesRemoved}
                onIdentityAdded={this.onIdentityAdded}
                onIdentityRemoved={this.onIdentityRemoved}
                pickerProvider={this.pickerProvider}
                selectedIdentities={this.selectedIdentities}
                // disabled={this.disabled}
                />
                </div>
               
                </Form.Group>
            );
        // return (
        //     <div>
        //     <label className="form-label">{this.props.formProps.schema.title}</label>
        //     <div className="identity-picker-container" style={this.disabled ? {pointerEvents:'none'}: {}}>

        //     {this.disabled}    
        //     <IdentityPicker             
        //         onIdentitiesRemoved={this.onIdentitiesRemoved}
        //         onIdentityAdded={this.onIdentityAdded}
        //         onIdentityRemoved={this.onIdentityRemoved}
        //         pickerProvider={this.pickerProvider}
        //         selectedIdentities={this.selectedIdentities}
        //         // disabled={this.disabled}
        //     />
            
        //     </div>
        //     </div>
        // ) 
        // }  
            }

    private onIdentitiesRemoved = (identities: IIdentity[]) => {
        Logger.debug(
            `Identity Removed: ${identities.map((identity) => identity.displayName).join(", ")}`
        );
        

        this.selectedIdentities.value = this.selectedIdentities.value.filter(
            (entity: IIdentity) =>
                identities.filter((item) => item.entityId === entity.entityId).length === 0
        );
        this.updateFormProps();
    };

    private onIdentityAdded = (identity: IIdentity) => {
        Logger.debug(`Identity Added: ${identity.displayName}`);
        Logger.debug(`Identity Added: ${JSON.stringify(identity)}`)
        this.selectedIdentities.push(identity);
        this.updateFormProps();
    };

    private onIdentityRemoved = (identity: IIdentity) => {
        Logger.debug(`Identity Added: ${identity.displayName}`);
        this.selectedIdentities.value = this.selectedIdentities.value.filter(
            (entity: IIdentity) => entity.entityId !== identity.entityId
        );
        this.updateFormProps();
    };

    private updateFormProps()
    {
        // csv of users mails for now
        let strRep = this.selectedIdentities.value.map((a) => ( getIdentityField(a) )).join(",")
        const {
            options,
        } = this.props.formProps!;
        // must call on change with emptyValue for 'required' to work  
        this.props.formProps.onChange(strRep === "" ? options.emptyValue : strRep)
    }
}