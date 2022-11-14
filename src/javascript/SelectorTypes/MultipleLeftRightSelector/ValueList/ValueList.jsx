import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {ListItem, Typography, ChevronRight, ChevronLeft} from '@jahia/moonstone';
import styles from './ValueList.scss';
import cslx from 'clsx';

const ValueList = ({values, filter, isMultiple, selected, onSelect, onMove, orientation}) => {
    // Clear selection if filter changed
    useEffect(() => {
        onSelect([]);
    }, [filter]); //eslint-disable-line

    const iconProp = value => {
        if (orientation === 'right') {
            return {
                iconEnd: <ChevronRight className={styles.displayNone}
                                       onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMove([value]);
                }}/>
            };
        }

        return {
            iconStart: <ChevronLeft className={styles.displayNone}
                                    onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMove([value]);
                }}/>
        };
    };

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
                                 {...iconProp(v.value)}
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
    onSelect: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    orientation: PropTypes.string.isRequired
};

export default ValueList;
