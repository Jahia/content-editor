import React from 'react';
import * as PropTypes from 'prop-types';
import SelectorTypes from '../SelectorTypes';
import EditNodeProperty from './EditNodeProperty';

export const EditNodePropertyContainer = ({field, siteInfo}) => {
    let FieldComponent = SelectorTypes[field.formDefinition.selectorType];
    if (!FieldComponent) {
        console.warn('no Renderer for ', field.formDefinition.selectorType);
        return <></>;
    }

    return (
        <EditNodeProperty field={field} labelHtmlFor={field.formDefinition.name} siteInfo={siteInfo}>
            <FieldComponent field={field} id={field.formDefinition.name}/>
        </EditNodeProperty>
    );
};

EditNodePropertyContainer.propTypes = {
    field: PropTypes.shape({
        formDefinition: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    siteInfo: PropTypes.object.isRequired
};

export default EditNodePropertyContainer;
