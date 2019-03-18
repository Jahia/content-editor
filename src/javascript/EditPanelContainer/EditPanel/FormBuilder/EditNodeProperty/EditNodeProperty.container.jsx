import React from 'react';
import * as PropTypes from 'prop-types';
import SelectorTypes from '../SelectorTypes';
import EditNodeProperty from './EditNodeProperty';

export const EditNodePropertyContainer = ({field}) => {
    let FieldComponent = SelectorTypes[field.formDefinition.selectorType];
    if (!FieldComponent) {
        console.warn('no Renderer for ', field.formDefinition.selectorType);
        return <></>;
    }
    return (
        <EditNodeProperty field={field}>
            <FieldComponent field={field}/>
        </EditNodeProperty>
    );
};

EditNodePropertyContainer.propTypes = {
    field: PropTypes.object.isRequired
};

export default EditNodePropertyContainer;

