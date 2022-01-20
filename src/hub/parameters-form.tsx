import * as React from "react";
import * as ReactDOM from "react-dom";

import { Card } from "azure-devops-ui/Card";

import {Form, Widgets} from "@rjsf/bootstrap-4";

import { JSONSchema7} from 'json-schema';

import {widgets} from "./form-widgets"

export interface ParametersFormProps {
    onSubmit: (props:any)  => any
    schema: JSONSchema7,
    uiSchema: {},
    formData : {}
}



export class ParametersForm extends React.Component<ParametersFormProps, {}> {

    constructor(props: ParametersFormProps) {
        super(props);
    } 

    componentDidMount() {
    }

    render(): JSX.Element { 
        return (
            <Card>
                <Form onSubmit={this.props.onSubmit} schema={this.props.schema}
                    uiSchema={this.props.uiSchema} widgets={widgets} 
                    className="flex-grow" formData={this.props.formData}
                    />
            </Card>
        )
    }
}

