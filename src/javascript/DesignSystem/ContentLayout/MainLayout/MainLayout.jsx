import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './MainLayout.scss';

export const MainLayout = ({header, children}) => (
    <main className={clsx(styles.root, 'flexCol')}>
        { header && header}
        <div className={clsx(styles.content, 'flexCol')}>
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
