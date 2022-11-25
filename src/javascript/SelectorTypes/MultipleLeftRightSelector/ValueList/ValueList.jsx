import React from 'react';
import PropTypes from 'prop-types';
import {ListItem, Typography, ChevronRight, Close, HandleDrag} from '@jahia/moonstone';
import styles from './ValueList.scss';
import cslx from 'clsx';

const ValueList = ({values, filter, onMove, orientation, listItemProps = () => ({}), iconStartProps = () => ({})}) => {
    const iconProp = v => {
        if (orientation === 'left') {
            return {
                iconEnd: (
                    <div className={styles.iconContainer}>
                        <ChevronRight className={styles.displayNone}
                                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        onMove([v.value]);
                                           }}/>
                    </div>
                )
            };
        }

        return {
            iconEnd: (
                <div className={styles.iconContainer}>
                    <Close className={styles.displayNone}
                           onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        onMove([v.value]);
                    }}/>
                </div>
            ),
            iconStart: <div className={styles.iconContainer} {...iconStartProps(v)}>
                <HandleDrag/>
            </div>
        };
    };

    return (
        <>
            <ul className={styles.valueList}>
                {values.filter(v => ((!filter || filter === '') || v.label.toLowerCase().indexOf(filter.toLowerCase()) !== -1)).map((v, index) => {
                   return (
                       <ListItem key={v.label}
                                 className={cslx(styles.valueListItem)}
                                 typographyVariant="body"
                                 label={v.label}
                                 {...iconProp({value: v.value, index: index})}
                                 {...listItemProps({value: v.value, index: index})}
                       />
                   );
                })}
            </ul>
            <div className={styles.captionContainer}>
                {orientation === 'right' &&
                    <Typography variant="caption" weight="semiBold">
                        {values.length > 0 && `Selected ${values.length} items`}
                    </Typography>
                }
            </div>
        </>
    );
};

ValueList.propTypes = {
    values: PropTypes.array,
    filter: PropTypes.string,
    onMove: PropTypes.func.isRequired,
    orientation: PropTypes.string.isRequired
};

export default ValueList;
