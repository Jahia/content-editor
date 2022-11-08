import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {ListItem, Typography} from '@jahia/moonstone';
import styles from './ValueList.scss';
import cslx from 'clsx';

const ValueList = ({values, filter, isMultiple, selected, onSelect}) => {
    // Clear selection if filter changed
    useEffect(() => {
        onSelect([]);
    }, [filter]); //eslint-disable-line

    return (
        <>
            <ul className={styles.valueList}>
                {values.filter(v => ((!filter || filter === '') || v.label.toLowerCase().indexOf(filter.toLowerCase()) !== -1)).map(v => {
                    const isSelected = selected.includes(v.value);
                   return (
                       <ListItem key={v.label}
                                 className={isSelected ? cslx(styles.valueListItem, styles.selected) : cslx(styles.valueListItem)}
                                 typographyVariant="body"
                                 label={v.label}
                                 onClick={e => {
                                     e.preventDefault();
                                     e.stopPropagation();

                                     if (isSelected) {
                                         const newValue = selected.filter(s => s !== v.value);
                                         onSelect(newValue);
                                         return;
                                     }

                                     if (isMultiple) {
                                         const newValue = Array.from(new Set([...selected, v.value]));
                                         onSelect(newValue);
                                     } else {
                                         const newValue = [v.value];
                                         onSelect(newValue);
                                     }
                                 }}
                       />
                   );
                })}
            </ul>
            <Typography className={styles.caption} variant="caption" weight="semiBold">
                {selected.length > 0 && `Selected ${selected.length} items`}
            </Typography>
        </>
    );
};

ValueList.propTypes = {
    values: PropTypes.array,
    filter: PropTypes.string,
    isMultiple: PropTypes.bool,
    selected: PropTypes.array,
    onSelect: PropTypes.func
};

export default ValueList;
