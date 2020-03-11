import React from 'react';
import PropTypes from 'prop-types';
import styles from './ContentHeader.scss';

const ContentHeader = ({children}) => (
    <header className={styles.header}>
        {children}
    </header>
);

ContentHeader.propTypes = {
    children: PropTypes.node.isRequired
};

export default ContentHeader;
