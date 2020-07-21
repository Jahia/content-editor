import React from 'react';
import PropTypes from 'prop-types';
import {Separator} from '@jahia/moonstone';
import styles from './ContentBreadcrumb.scss';
import ContentPath from './ContentPath';
import ContentType from './ContentType';

const ContentBreadcrumb = ({path}) => {
    return (
        <div className={styles.contentBreadcrumb} data-sel-role="breadcrumb">
            <ContentPath path={path}/>
            <Separator variant="vertical"/>
            <ContentType path={path}/>
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
