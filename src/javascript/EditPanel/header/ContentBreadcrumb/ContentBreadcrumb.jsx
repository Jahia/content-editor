import React from 'react';
import PropTypes from 'prop-types';
import styles from './ContentBreadcrumb.scss';
import ContentPath from './ContentPath';
import ContentType from './ContentType';

const ContentBreadcrumb = ({path, ...context}) => {
    return (
        <div className={styles.contentBreadcrumb} data-sel-role="breadcrumb">
            <ContentPath path={path} {...context}/>
            <ContentType path={path}/>
        </div>
    );
};

ContentBreadcrumb.defaultProps = {
    path: '',
    context: null
};

ContentBreadcrumb.propTypes = {
    path: PropTypes.string,
    context: PropTypes.object
};

export default ContentBreadcrumb;
