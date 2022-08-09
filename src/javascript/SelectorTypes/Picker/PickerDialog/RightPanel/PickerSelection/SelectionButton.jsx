import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Selection.scss';
import {ChevronRight, Typography} from '@jahia/moonstone';

export const SelectionButton = ({label, className, expanded}) => {
    const isExpanded = expanded[0];

    const classNameProps = clsx(
        styles.selectionButton,
        className,
        'moonstone-collapsible_button flexRow alignCenter'
    );

    return (
        <button type="button" className={classNameProps} aria-expanded={isExpanded} onClick={() => {}}>
            <ChevronRight className={clsx('moonstone-collapsible_icon', {'moonstone-collapsible_icon_expanded': isExpanded})}/>
            <Typography isNowrap component="span">{label}</Typography>
        </button>
    );
};

SelectionButton.propTypes = {
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    expanded: PropTypes.arrayOf(PropTypes.shape({
        isExpanded: PropTypes.bool.isRequired,
        setExpanded: PropTypes.func.isRequired
    }))
};
