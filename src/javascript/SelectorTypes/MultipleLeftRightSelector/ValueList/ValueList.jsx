import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {ListItem} from '@jahia/moonstone';
import styles from './ValueList.scss';
import cslx from 'clsx';

const ValueList = ({values, filter, isMultiple, onSelect}) => {
    const [selected, setSelected] = useState([]);

    // Clear selection if filter changed
    useEffect(() => {
        setSelected([]);
        onSelect([]);
    }, [filter, onSelect]);

    return (
        <ul className={styles.valueList}>
            {values.filter(v => ((!filter || filter === '') || v.value.toLowerCase().indexOf(filter.toLowerCase()) !== -1)).map(v => {
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
                                     setSelected(newValue);
                                     onSelect(newValue);
                                     return;
                                 }

                                 if (isMultiple) {
                                     const newValue = Array.from(new Set([...selected, v.value]));
                                     setSelected(newValue);
                                     onSelect(newValue);
                                 } else {
                                     const newValue = [v.value];
                                     setSelected(newValue);
                                     onSelect(newValue);
                                 }
                             }}
                   />
               );
            })}
        </ul>
    );
};

ValueList.propTypes = {
    values: PropTypes.array,
    filter: PropTypes.string,
    isMultiple: PropTypes.bool,
    onSelect: PropTypes.func
};

export default ValueList;
