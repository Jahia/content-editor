import React from 'react';
import PropTypes from 'prop-types';

import {Typography} from '@jahia/ds-mui-theme';
import {withStyles} from '@material-ui/core/styles';

const style = theme => ({
    container: {
        listStyle: 'none',
        height: '100%',
        overflowY: 'auto',
        boxShadow: '0px 2px 6px rgba(57, 69, 77, 0.2)',
        border: `1px solid ${theme.palette.ui.omega}`,
        borderRadius: '2px',
        padding: 0,
        margin: 0,
        width: '150px'
    },
    child: {
        height: '2rem',
        paddingLeft: '1rem',
        boxSizing: 'border-box',

        display: 'flex',
        alignItems: 'center',
        width: '100%'
    },
    childSelected: {
        backgroundColor: theme.palette.hover.beta || '#F2F5F6'
    }
});

const hours = new Array(24).fill().reduce((acc, _, i) => {
    return [...acc, `${i}:00`, `${i}:30`];
}, []);

const TimeSelectorCmp = ({classes, selectedHour, onHourSelected, ...props}) => {
    return (
        <ul className={classes.container} {...props}>
            {hours.map(hour => (
                <Typography
                    key={hour}
                    tabIndex="0"
                    className={`${classes.child} ${
                        selectedHour === hour ? classes.childSelected : ''
                    }`}
                    component="li"
                    variant="zeta"
                    onClick={() => onHourSelected(hour)}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            onHourSelected(hour);
                        }
                    }}
                >
                    {hour}
                </Typography>
            ))}
        </ul>
    );
};

TimeSelectorCmp.defaultProps = {
    onHourSelected: () => {},
    selectedHour: null
};

TimeSelectorCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    onHourSelected: PropTypes.func,
    selectedHour: PropTypes.string
};

export const TimeSelector = withStyles(style)(TimeSelectorCmp);
