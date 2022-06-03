import React from 'react';
import PropTypes from 'prop-types';

import {Input} from '@jahia/design-system-kit';
import {Search} from '@jahia/moonstone';
import {FolderDisplayer} from './FolderDisplayer';

export const SearchInput = ({selectedPath, placeholder, language, ...props}) => {
    return (
        <Input
            type="text"
            data-sel-role="data-sel-picker-search"
            placeholder={placeholder}
            variant={{icon: <Search/>, interactive: <FolderDisplayer selectedPath={selectedPath} language={language}/>}}
            {...props}
        />
    );
};

SearchInput.propTypes = {
    selectedPath: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
};
