

import * as React from "react";
import {Widgets, Fields } from "@rjsf/bootstrap-4";
import { FieldProps, WidgetProps, utils   } from "@rjsf/core";
import Linkify from 'linkify-react';

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

const linkOptions={
  className : "text-primary",
  attributes: {
    target:  "_blank"
  },
  format: {
    // url: (value:any) => value.length > 50 ? value.slice(0, 50) + '…' : value
    url: (value:any) => "Link"
  }
}

/**
 * Not great but rjsf doesn't provide the hooks to override some of the widgets/fields to Linkify the labels
 * 
 * This one causes strange recursion errors... so is not used
 * @param props props normally passed to the StringField
 * @returns 
 */
const LinkifiedStringField = (props:any) => {
  const {
    schema,
    name,
    uiSchema,
    idSchema,
    formData,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    registry = utils.getDefaultRegistry(),
    rawErrors
  } = props;

    const { title, format } = schema!;
    const { widgets, formContext } = registry;
    const enumOptions = utils.isSelect(schema!) && utils.optionsList(schema!);
    let defaultWidget = enumOptions ? "select" : "text";
    if (format && utils.hasWidget(schema!, format, widgets)) {
      defaultWidget = format;
    }
    const { widget = defaultWidget, placeholder = "", ...options } = utils.getUiOptions(uiSchema!)!;
    let w:any  = widget
    let p:any = placeholder
    const Widget = utils.getWidget(schema!, w, widgets);
    var newlabel = <Linkify options={linkOptions}>{title === undefined ? name : title}</Linkify>
    return (
      <Widget 
        options={{ ...options, enumOptions }}
        schema={schema}
        uiSchema={uiSchema}
        id={idSchema && idSchema.$id}
        label={newlabel}
        value={formData}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        required={required}
        disabled={disabled}
        readonly={readonly}
        formContext={formContext}
        autofocus={autofocus}
        registry={registry}
        placeholder={p}
        rawErrors={rawErrors}
      />
    );
}

  /**
 * Not great but rjsf doesn't provide the hooks to override some of the widgets/fields to Linkify the labels
 * 
 * @param props props normally passed to the TitleField
 * @returns TitleField with label linkified
 */
const LinkifiedTitleField = ({ title, uiSchema }: Partial<FieldProps>) => (
    <>
      <div className="my-1">
        <Linkify options={linkOptions}><h5>{(uiSchema && uiSchema["ui:title"]) || title}</h5></Linkify>
        <hr className="border-0 bg-secondary" style={{ height: "1px" }} />
      </div>
    </>
);

/**
 * Not great but rjsf doesn't provide the hooks to override some of the widgets/fields to Linkify the labels
 * 
 * @param props props normally passed to the CheckBox 
 * @returns CheckboxWidget with label linkified
 */
const LinkifiedCheckBox =  (props: WidgetProps) => {
    const {
      label,
    } = props;

    var newlabel = <Linkify options={linkOptions} >{label}</Linkify>
    return ( 
        <Widgets.CheckboxWidget {...{...props, label:newlabel}}></Widgets.CheckboxWidget>
    )
}

/**
 * Not great but rjsf doesn't provide the hooks to override some of the widgets/fields to Linkify the labels
 * 
 * @param props props normally passed to the TextWidget 
 * @returns TextWidget with label linkified
 */
const LinkifiedTextWidget = (props:WidgetProps) => {
  const {
    label,
} = props;

  var newlabel = <Linkify options={linkOptions}>{label}</Linkify>
    
  return ( 
      <Widgets.TextWidget {...{...props, label:newlabel}}></Widgets.TextWidget>
  )
}

export const widgets = {
  identityWidget: IdentityWidget,
  currentIdentityWidget: CurrentIdentityWidget,
  identitiesWidget: IdentitiesWidget,
  currentIdentitiesWidget: CurrentIdentitiesWidget,
  currentUserName: Widgets.TextWidget,
  currentUserEmail: Widgets.TextWidget,
  currentUserLoginEmail: Widgets.TextWidget,
  currentProject: Widgets.SelectWidget,
  reposInCurrentProject: Widgets.SelectWidget,
  repos: Widgets.SelectWidget,
  CheckboxWidget: LinkifiedCheckBox,
  TextWidget: LinkifiedTextWidget
}; 

export const fields = {
  TitleField: LinkifiedTitleField,  
  //StringField: LinkifiedStringField //<- this causes JSON recursion errors. Shouldn't matter about links inside this field
}


// crazyness below trying to hollistically linkify everything..


// const CustomTitleField = ({title, required}:FieldProps): JSX.Element => {
//     const legend = required ? title + '*' : title;
//     Logger.debug(`legend ${legend}`)
//     return <div id="custom" dangerouslySetInnerHTML={{ __html: legend! }} />;
// };

// export const CustomFieldTemplate = (props:any) => {
//     const {id, classNames, label, help, required, description, errors, children} = props;

    
//     return (
//         <Linkify children={children}></Linkify>   
//     )

// }

// export const CustomFieldTemplate = ({
//     id,
//     children,
//     displayLabel,
//     rawErrors = [],
//     rawHelp,
//     rawDescription,
//   }: FieldTemplateProps) => {
//     return (
//       <Form.Group>
//         <Linkify>{children}</Linkify>
//         {displayLabel && rawDescription ? (
//           <Form.Text className={rawErrors.length > 0 ? "text-danger" : "text-muted"}>
//             {rawDescription}
//           </Form.Text>
//         ) : null}
//         {rawErrors.length > 0 && (
//           <ListGroup as="ul">
//             {rawErrors.map((error: string) => {
//               return (
//                 <ListGroup.Item as="li" key={error} className="border-0 m-0 p-0">
//                   <small className="m-0 text-danger">
//                     {error}
//                   </small>
//                 </ListGroup.Item>
//               );
//             })}
//           </ListGroup>
//         )}
//         {rawHelp && (
//           <Form.Text
//             className={rawErrors.length > 0 ? "text-danger" : "text-muted"}
//             id={id}>
//             {rawHelp}
//           </Form.Text>
//         )}
//       </Form.Group>
//     );
//   };

// export const ObjectFieldTemplate = ({
//     DescriptionField,
//     description,
//     TitleField,
//     title,
//     properties,
//     required,
//     uiSchema,
//     idSchema,
//   }: ObjectFieldTemplateProps) => {
//     return (
//       <>
//         {(uiSchema["ui:title"] || title) && (
//           <TitleField
//             id={`${idSchema.$id}-title`}
//             title={uiSchema["ui:title"] || title}
//             required={required}
//           />
//         )}
//         {description && (
//           <DescriptionField
//             id={`${idSchema.$id}-description`}
//             description={description}
//           />
//         )}
//         <Container fluid className="p-0">
//           {properties.map((element: any, index: number) => (
//             <Row
//               key={index}
//               style={{ marginBottom: "10px" }}
//               className={element.hidden ? "d-none" : undefined}>
//               <Col xs={12}> <Linkify> {element.content}</Linkify> </Col>
//             </Row>
//           ))}
//         </Container>
//       </>
//     );
//   };

// export const fields = {
//     TitleField: CustomTitleField
//   };


// const mapRecursive = (children:any, callback:any):void => (
//     React.Children.map(
//       children,
//       child => (
//         child!==null && child.props!==null
//           ? [callback(child), mapRecursive(child.props.children, callback)]
//           : callback(child)
//       ),
//     )
//   );

// interface Props {
// children?: React.ReactNode;
// }

// // const DeepMapped = ({ children }: Props): React.ReactElement => (
// // <div>
// //     {deepMap(children, (child: React.ReactNode) => {
// //     if (child && (child as React.ReactElement).type === 'b') {
// //         return React.cloneElement(child as React.ReactElement, {
// //         ...(child as React.ReactElement).props,
// //         className: 'mapped',
// //         });
// //     }
// //     return child;
// //     })}
// // </div>
// // );

// // const Mapl = ({ children }: Props): React.ReactElement => (
// //     <div>
// //         Hi
// //         {deepMap(children, (child: React.ReactNode) => {
// //             if (child)
// //             {
// //                 Logger.debug("child")
// //                 return <Linkify>{child}</Linkify>
// //                 // return React.cloneElement(child as React.ReactElement, {
// //                 //     ...(child as React.ReactElement).props,
// //                 // }
// //             }
// //             return child;
// //     })}
// //     </div>
// // );



// export const LinkifyChildren = (props:any) => {
//     const {children} = props;

//     if(children!==null){
//         Logger.debug(`child type ${JSON.stringify(children.type)}`)
//     }
//     return (<Linkify>{children}</Linkify>)

// }

// export const CustomFieldTemplate = (props:any) => {
//     const {id, classNames, label, help, required, description, errors, children} = props;
    
//     const c:Field = children
//     const w:Widget = children
    
    
    

//     // Logger.debug(`Children: ${simpleStringify(children.props)}`)
    
//     // var s = HTMLReactParser(ReactDOMServer.renderToString(children))

//     // Logger.debug(`toString ${ReactDOMServer.renderToString(children)}`)
    
//     // var lprops:Linkify.Props = {
        
//     // }

//     // React.Children.map(children, function[(thisArg)])

//     // var wrapchilren: React.ReactElement[] =[]
    
//     // if(children!==null){
//     //     wrapchilren = deepMap(children, (child:any, i:any)=>{
//     //         Logger.debug("in deepMap")
//     //         if(child!==null){
//     //             return <Linkify> child</Linkify>
//     //         }    
//     //     })
//     // }

//     // const testRenderer = TestRenderer.create(children);

//     // Logger.debug(`test render ${testRenderer.toJSON()}`)



//     Logger.debug(`rend to str ${ReactDOMServer.renderToString(<Linkify><div className="blah">www2.google.com</div>{children}</Linkify>)}`);
    
//     var rcb = <Linkify><label className="blah">www2.google.com</label></Linkify>;

//     var rc = Linkify({children})
    
//     Logger.debug(`rc rend to str ${ReactDOMServer.renderToString(rc)}`);

//     var el:React.Component = children
    
    


//     return (
//     //    <Linkify>
//         <div>
//             <div>www.google.com</div>

//             <div className={classNames}>
//                 {/* <label htmlFor={id}>{label}{required ? "*" : null}</label> */} 
//                 {/* label={label} */}
//                 {description}

//                 <LinkifyChildren>{children}</LinkifyChildren>
//                 <LinkifyChildren>www.blah.com</LinkifyChildren>

//                 {/* <Mapl>{children}</Mapl> */}
//                 {/* <div ><input /><label >I declare I am not on the US Embargo List for the ratings listed in the Export Control Cloud Policy (https://rollsroyce.sharepoint.com/sites/engineroom/en-gb/exportcontrol/Documents/Guidance%20Documents/Export%20Cloud%20Policy.pdf). This includes not being a national of countries Cuba, Iran, North Korea, Sudan, Syria. If you have multiple citizenships or nationalities, this is your latest or any of your dual-nationalities. Please check with your local EPOC if you have any doubts regarding access to US data. </label></div> */}
                
//                 {/* {children}
//                 {
//                     if(children!==null){
//                         deepMap(children, (child:any, i:any)=>{
//                             Logger.debug("in deepMap")
//                             if(child!==null){
//                                 return <Linkify> child</Linkify>
//                             }    
//                         })
//                     }
//                 } */}

//                 {errors}
//                 {help}
//             </div>
//         </div>
//     //   </Linkify> 
//     );
// }

// export const ObjectFieldTemplate = ({ TitleField, properties, title, description } : { TitleField:any, properties:any, title:any, description:any }) => {
//     return (
//       <div>
//         <Linkify> 
//         <TitleField title={title} />
//         {properties.map( (element:any) => <Linkify> {element.content}</Linkify> )}
//         </Linkify> 
//       </div>
//     );
//   }

// function simpleStringify (object:any){
//     var simpleObject:any = {};
//     for (var prop in object ){
//         // if (!object.hasOwnProperty(prop)){
//         //     continue;
//         // }
//         if (typeof(object[prop]) == 'object'){
//             continue;
//         }
//         // if (typeof(object[prop]) == 'function'){
//         //     continue;
//         // }
//         simpleObject[prop] = object[prop];
//     }
//     return JSON.stringify(simpleObject); // returns cleaned up JSON
// };


// const LinkifiedCheckBox1 = (props: WidgetProps) => {
//   const {
//     id,
//     value,
//     required,
//     disabled,
//     readonly,
//     label,
//     schema,
//     autofocus,
//     onChange,
//     onBlur,
//     onFocus,
//   } = props;

//   const _onChange = ({
//     target: { checked },
//   }: React.FocusEvent<HTMLInputElement>) => onChange(checked);
//   const _onBlur = ({
//     target: { checked },
//   }: React.FocusEvent<HTMLInputElement>) => onBlur(id, checked);
//   const _onFocus = ({
//     target: { checked },
//   }: React.FocusEvent<HTMLInputElement>) => onFocus(id, checked);

//   const desc = label || schema.description;

//   return (
//     <Form.Group  className={`checkbox ${disabled || readonly ? "disabled" : ""}`}>
//         <Form.Check
//           id={id}
//           label={<Linkify>{desc}</Linkify>}
//           checked={typeof value === "undefined" ? false : value}
//           required={required}
//           disabled={disabled || readonly}
//           autoFocus={autofocus}
//           onChange={_onChange}
//           type="checkbox"
//           onBlur={_onBlur}
//           onFocus={_onFocus}
//         />
//         </Form.Group>
//   );
// };