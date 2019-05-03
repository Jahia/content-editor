import React from 'react';
import * as PropTypes from 'prop-types';
import SelectorTypes from '../SelectorTypes';
import EditNodeProperty from './EditNodeProperty';

export const EditNodePropertyContainer = ({field, siteInfo, editorContext}) => {
    let FieldComponent = SelectorTypes[field.formDefinition.selectorType];
    if (!FieldComponent) {
        console.warn('no Renderer for ', field.formDefinition.selectorType);
        return <></>;
    }

    return (
        <EditNodeProperty field={field} labelHtmlFor={field.formDefinition.name} siteInfo={siteInfo}>
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
