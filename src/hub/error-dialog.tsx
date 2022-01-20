import * as React from "react";
import { Button } from "azure-devops-ui/Button";
import { Dialog } from "azure-devops-ui/Dialog";
import { Observer } from "azure-devops-ui/Observer";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Link } from "azure-devops-ui/Link";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";

export interface ErrorDialogProps {
    isDialogOpen: boolean,
    errorMsg:string,
    onClose: () => any
}


export class ErrorDialog extends React.Component<ErrorDialogProps> {
    private isDialogOpen = new ObservableValue<boolean>(true);

    constructor(props: ErrorDialogProps) {
        super(props);
        this.isDialogOpen.value = props.isDialogOpen;
    }

    public render() {
        const onDismiss = () => {
            this.isDialogOpen.value = false;
            this.props.onClose();
        };
        return (
            <div>
                <Observer isDialogOpen={this.isDialogOpen}>
                    {(props: { isDialogOpen: boolean }) => {
                        return props.isDialogOpen ? (
                            <Dialog 
                                titleProps={{ text: "Error" }}
                                footerButtonProps={[
                                    {
                                        text: "Close",
                                        onClick: onDismiss,
                                        primary: true
                                    }
                                ]}
                                onDismiss={onDismiss}
                            >
                            <div className="flex-grow">
                                <div className="row mx-auto" style={{ }}>
                                    <div className="col-sm-2 mx-auto" style={{ }}>
                                        <Status
                                        {...Statuses.Failed}
                                            key="failed"
                                            size={StatusSize.m}
                                            className=" mx-auto w-100"
                                            
                                        />
                                    </div>
                                    
                                    
                                    <div className="col-sm-10">    
                                    Automation pipeline failed. 
                                         <div className="flex-grow"> 
                                            {this.props.errorMsg}
                                             </div>   
                                    </div>
                                </div>        
                             </div>           
                            </Dialog>
                        ) : null;
                    }}
                </Observer>
            </div>
        );
    }
}