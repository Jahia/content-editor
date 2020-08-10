import PropTypes from 'prop-types';
import React from 'react';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import Text from '~/SelectorTypes/Text';
import {Constants} from '~/ContentEditor.constants';

export const SystemNameCmp = ({field, value, id, editorContext, onChange}) => {
    // TODO: BACKLOG-14328 sync button
    return (
        <Text
            field={{...field, readOnly: field.readOnly || (editorContext.name && editorContext.mode === Constants.routes.baseCreateRoute)}}
            value={value}
            id={id}
            editorContext={editorContext}
            onChange={onChange}
        />
    );
};

SystemNameCmp.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired
};

const SystemName = SystemNameCmp;
SystemName.displayName = 'SystemName';
export default SystemName;
