import React from 'react';
import classnames from 'clsx';
import PropTypes from 'prop-types';
import styles from './MainLayout.scss';

export const MainLayout = ({header, children}) => (
    <main className={classnames(styles.root, 'flexCol')}>
        { header &&
        header}
        <div className={classnames(styles.content, 'flexCol')}>
            {children}
        </div>
    </main>
);

MainLayout.propTypes = {
    header: PropTypes.node,
    children: PropTypes.node.isRequired
};

MainLayout.defaultProps = {
    header: null
};

export default MainLayout;
