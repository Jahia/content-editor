import PropTypes from 'prop-types';
import React from 'react';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import Text from '~/SelectorTypes/Text';

export const SystemNameCmp = ({field, value, id, editorContext, onChange}) => {
    // TODO: BACKLOG-14328 sync button
    return (
        <Text
            field={field}
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
