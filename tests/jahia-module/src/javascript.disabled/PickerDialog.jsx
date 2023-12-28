import React from 'react';
import PropTypes from 'prop-types';
import {useNodeInfo} from '@jahia/data-helper';

export const PickerDialog = ({onItemSelection}) => {
    const {node, loading} = useNodeInfo({path: '/sites/digitall/files/images/people/user.jpg'});

    if (loading) {
        return false;
    }

    return (
        <div>
            <span>Test picker - {node.path}</span>
            <button data-sel-role="custom-selector" type="button" onClick={() => onItemSelection([{...node, url:'http://zzzz/'}])}>select</button>
        </div>
    );
};

PickerDialog.propTypes = {
    onItemSelection: PropTypes.func.isRequired,
};
