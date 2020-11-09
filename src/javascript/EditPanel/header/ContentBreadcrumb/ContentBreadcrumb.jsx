import React from 'react';
import PropTypes from 'prop-types';
import styles from './ContentBreadcrumb.scss';
import ContentPath from './ContentPath';
import ContentType from './ContentType';

const ContentBreadcrumb = ({path, ...context}) => {
    return (
        <div className={styles.contentBreadcrumb} data-sel-role="breadcrumb">
            <ContentPath path={path} {...context}/>
            <ContentType name={context.nodeTypeName} displayName={context.nodeTypeDisplayName}/>
        </div>
    );
};

ContentBreadcrumb.defaultProps = {
    path: ''
};

ContentBreadcrumb.propTypes = {
    path: PropTypes.string,
    actionContext: PropTypes.shape({
        nodeTypeDisplayName: PropTypes.string.isRequired,
        nodeTypeName: PropTypes.string.isRequired
    }).isRequired
};

export default ContentBreadcrumb;
