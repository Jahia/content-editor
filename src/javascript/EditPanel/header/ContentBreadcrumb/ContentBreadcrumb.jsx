import React from 'react';
import PropTypes from 'prop-types';
import styles from './ContentBreadcrumb.scss';
import ContentPath from './ContentPath';
import ContentType from './ContentType';
import {useContentEditorContext} from '~/ContentEditor.context';

const ContentBreadcrumb = ({path}) => {
    const {nodeTypeName, nodeTypeDisplayName} = useContentEditorContext();

    return (
        <div className={styles.contentBreadcrumb} data-sel-role="breadcrumb">
            <ContentPath path={path}/>
            <ContentType name={nodeTypeName} displayName={nodeTypeDisplayName}/>
        </div>
    );
};

ContentBreadcrumb.defaultProps = {
    path: ''
};

ContentBreadcrumb.propTypes = {
    path: PropTypes.string
};

export default ContentBreadcrumb;
