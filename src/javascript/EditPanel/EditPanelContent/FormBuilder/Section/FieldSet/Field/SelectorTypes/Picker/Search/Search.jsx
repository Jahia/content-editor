import React from 'react';
import PropTypes from 'prop-types';

import {Input} from '@jahia/design-system-kit';
import {Search} from '@material-ui/icons';
import {FolderDisplayer} from './FolderDisplayer';

export const SearchInput = ({selectedPath, placeholder, ...props}) => {
    return (
        <Input
            type="text"
            placeholder={placeholder}
            variant={{icon: <Search/>, interactive: <FolderDisplayer selectedPath={selectedPath}/>}}
            {...props}
        />
    );
};

SearchInput.propTypes = {
    selectedPath: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired
};
