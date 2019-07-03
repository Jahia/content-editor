import React, {useContext} from 'react';
import * as PropTypes from 'prop-types';
import SelectorTypes from '../SelectorTypes';
import EditNodeProperty from './EditNodeProperty';
import {DxContext} from '@jahia/react-material';
import {FieldPropTypes} from '../../../../FormDefinitions';

export const EditNodePropertyContainer = ({field, siteInfo}) => {
    let selectorType = SelectorTypes.resolveSelectorType(field.formDefinition.selectorType, field.formDefinition.selectorOptions);
    const dxContext = useContext(DxContext);

    if (!selectorType) {
        if (field.formDefinition.selectorType) {
            console.warn('No renderer component for selectorType=', field.formDefinition.selectorType, ' for field ', field.formDefinition.name);
        } else {
            console.warn('Field ', field.formDefinition.name, ' has no selectorType !');
        }

        return <></>;
    }

    return (
        <EditNodeProperty field={field}
                          labelHtmlFor={field.formDefinition.name}
                          siteInfo={siteInfo}
                          selectorType={selectorType}
                          dxContext={dxContext}
                />
    );
};

EditNodePropertyContainer.propTypes = {
    field: FieldPropTypes.isRequired,
    siteInfo: PropTypes.object.isRequired
};

export default EditNodePropertyContainer;
