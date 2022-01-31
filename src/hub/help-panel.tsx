import * as React from "react";
import { useRef, useEffect, createRef } from 'react';
// import { CodeBlock, googlecode,dracula } from "react-code-blocks";
import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js';

import { ObservableValue } from "azure-devops-ui/Core/Observable";

import { ISimpleListCell } from "azure-devops-ui/List";
import { Link } from "azure-devops-ui/Link";
import { MenuItemType } from "azure-devops-ui/Menu";
import { IStatusProps, Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import {
    ColumnMore,
    ColumnSelect,
    Table,
    ISimpleTableCell,
    renderSimpleCell,
    TableColumnLayout,
} from "azure-devops-ui/Table";

import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

import * as SimpleSchema from "./demo-schema";
import * as MD from './../../user-guide.md';
import { Logger } from "./logger";

export class HelpContent extends React.Component<any,any> {
    constructor(props:any) {
        super(props);
        this.state = { markdown: '' };
        }
        
    componentDidMount() {
        
        this.setState({ markdown: MD.default});
        Logger.info(`MD: ${JSON.stringify(MD)}`)
        hljs.highlightAll()
    }

    componentDidUpdate(){
        hljs.highlightAll()
    }

    render(): JSX.Element {
        return (
            <div>
               <Markdown>{this.state.markdown}</Markdown>
            </div>
        )
    }
}
