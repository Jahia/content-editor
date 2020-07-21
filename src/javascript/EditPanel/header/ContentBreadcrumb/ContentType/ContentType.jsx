import React from 'react';
import PropTypes from 'prop-types';
import {Chip} from '@jahia/moonstone';

import styles from './ContentType.scss';
import {getNodeTypeIcon} from '../ContentBreadcrumb.utils';

const ContentType = ({name, displayName}) => (
    <div className={styles.contentType}>
        <Chip color="accent" label={displayName || name} icon={getNodeTypeIcon(name)}/>
    </div>
);

ContentType.propTypes = {
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string
};

export default ContentType;
