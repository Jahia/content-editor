import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {useNodeInfo} from '@jahia/data-helper';

import ContentType from './ContentType';

const ContentTypeContainer = ({path}) => {
    const {displayLanguage} = useSelector(state => ({
        displayLanguage: state.uilang
    }));

    const {node} = useNodeInfo({path: path, displayLanguage}, {getPrimaryNodeType: true});
    const nodeType = node?.primaryNodeType;

    return nodeType ? <ContentType name={nodeType.name} displayName={nodeType.displayName}/> : null;
};

ContentTypeContainer.defaultProps = {
    path: ''
};

ContentTypeContainer.propTypes = {
    path: PropTypes.string
};

export default ContentTypeContainer;
