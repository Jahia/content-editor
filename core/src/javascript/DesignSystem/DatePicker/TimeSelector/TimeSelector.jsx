import React from 'react';
import PropTypes from 'prop-types';

import {Typography} from '@jahia/design-system-kit';
import {withStyles} from '@material-ui/core';
import {hours} from '../../DatePickerInput/date.util';

const style = theme => ({
    container: {
        backgroundColor: 'white',
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
    hour: {
        height: '2rem',
        paddingLeft: '1rem',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        cursor: 'pointer'
    },
    childSelected: {
        backgroundColor: theme.palette.hover.beta,
        '&:focus': {
            outline: 0
        }
    }
});

const TimeSelectorCmp = ({classes, disabledHours, selectedHour, onHourSelected, ...props}) => {
    return (
        <ul className={`TimePicker ${classes.container}`} {...props}>
            {hours(disabledHours).map(hour => (
                <Typography
                    key={hour}
                    tabIndex="0"
                    className={`${classes.hour} ${
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
    selectedHour: null,
    disabledHours: {}
};

TimeSelectorCmp.propTypes = {

    classes: PropTypes.object.isRequired,
    onHourSelected: PropTypes.func,
    selectedHour: PropTypes.string,
    disabledHours: PropTypes.shape({
        before: PropTypes.string,
        after: PropTypes.string
    })
};

export const TimeSelector = withStyles(style)(TimeSelectorCmp);

TimeSelector.displayName = 'TimeSelector';
