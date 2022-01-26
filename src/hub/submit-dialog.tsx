import * as React from "react";
import { Button } from "azure-devops-ui/Button";
import { Dialog } from "azure-devops-ui/Dialog";
import { Observer } from "azure-devops-ui/Observer";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Link } from "azure-devops-ui/Link";
import { Status, Statuses, StatusSize, StatusType } from "azure-devops-ui/Status";

export interface SubmitDialogProps {
    isDialogOpen: boolean,
    buildUrl:string
    onClose: () => any
}



export class SubmitDialog extends React.Component<SubmitDialogProps> {
    private isDialogOpen = new ObservableValue<boolean>(true);

    constructor(props: SubmitDialogProps) {
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
                {/* <Button
                    text="Open Dialog"
                    onClick={() => {
                        this.isDialogOpen.value = true;
                    }}
                /> */}
                <Observer isDialogOpen={this.isDialogOpen}>
                    {(props: { isDialogOpen: boolean }) => {
                        return props.isDialogOpen ? (
                            <Dialog 
                                titleProps={{ text: "Automation Submitted" }}
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
                                        {...Statuses.Success}
                                            key="success"
                                            size={StatusSize.m}
                                            className=" mx-auto w-100"
                                            
                                        />
                                    </div>
                                    
                                    
                                    <div className="col-sm-10">    
                                    Automation pipeline submitted. 
                                        {/* <div className="flex-grow"> */}
                                            <Link href={this.props.buildUrl} target="_blank"> Link to Pipeline</Link>
                                            {/* </div>   */}
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