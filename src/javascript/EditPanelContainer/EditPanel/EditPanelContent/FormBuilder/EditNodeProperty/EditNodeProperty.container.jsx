import React from 'react';
import * as PropTypes from 'prop-types';
import SelectorTypes from '../SelectorTypes';
import EditNodeProperty from './EditNodeProperty';

export const EditNodePropertyContainer = ({field, siteInfo, editorContext}) => {
    let componentType = SelectorTypes[field.formDefinition.selectorType];
    if (!componentType) {
        if (!field.formDefinition.selectorType) {
            console.warn('Field ', field.formDefinition.name, ' has no selectorType !');
        } else {
            console.warn('No renderer component for selectorType=', field.formDefinition.selectorType, ' for field ', field.formDefinition.name);
        }

        return <></>;
    }

    let fieldComponentDefinition = componentType(field.formDefinition.selectorOptions);
    let FieldComponent = fieldComponentDefinition.cmp;

    return (
        <EditNodeProperty field={field}
                          labelHtmlFor={field.formDefinition.name}
                          siteInfo={siteInfo}
                          fieldComponentKey={fieldComponentDefinition.key}
        >
            <FieldComponent field={field} id={field.formDefinition.name} editorContext={editorContext}/>
        </EditNodeProperty>
    );
};

EditNodePropertyContainer.propTypes = {
    editorContext: PropTypes.object.isRequired,
    field: PropTypes.shape({
        formDefinition: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    siteInfo: PropTypes.object.isRequired
};

export default EditNodePropertyContainer;
