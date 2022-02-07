import * as React from "react";
import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js';

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
