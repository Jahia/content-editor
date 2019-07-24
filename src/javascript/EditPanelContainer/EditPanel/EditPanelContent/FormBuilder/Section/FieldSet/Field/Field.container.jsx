import React, {useContext} from 'react';
import * as PropTypes from 'prop-types';
import EditNodeProperty from './EditNodeProperty';
import {DxContext} from '@jahia/react-material';
import {FieldPropTypes} from '../../../../FormDefinitions';
import {resolveSelectorType} from '../SelectorTypes/SelectorTypes.utils';

export const EditNodePropertyContainer = ({field, siteInfo}) => {
    const formDefinition = field.formDefinition;
    let selectorType = resolveSelectorType(formDefinition);
    const dxContext = useContext(DxContext);

    if (!selectorType) {
        if (formDefinition.selectorType) {
            console.warn('No renderer component for form definition:', formDefinition);
        } else {
            console.warn('Field ', formDefinition.name, ' has no selectorType !');
        }

        return <></>;
    }

    return (
        <EditNodeProperty field={field}
                          labelHtmlFor={formDefinition.name}
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
