import React from 'react';
import PropTypes from 'prop-types';

import {Chip} from '@jahia/design-system-kit';
import {Close} from '@material-ui/icons';

import {withStyles} from '@material-ui/core';

const styles = theme => ({
    chipReadOnly: {
        backgroundColor: theme.palette.ui.delta,
        color: theme.palette.invert.beta
    }
});

export const MultiValueCmp = ({data, removeProps, classes, ...other}) => {
    return (
        <Chip
            tabIndex="-1"
            label={data.label}
            className={other.isDisabled ? classes.chipReadOnly : ''}
            deleteIcon={
                <Close
                    {...removeProps}
                    focusable
                    tabIndex="0"
                    onKeyUp={e => {
                        e.stopPropagation();
                        if (e.keyCode === 13) {
                            removeProps.onClick(e);
                        }
                    }}
                />
            }
            variant={other.isDisabled ? 'secondary' : 'primary'}
            onDelete={other.isDisabled ? null : removeProps.onClick}
        />
    );
};

MultiValueCmp.propTypes = {
    data: PropTypes.shape({
        label: PropTypes.string
    }).isRequired,
    removeProps: PropTypes.shape({
        onClick: PropTypes.func.isRequired
    }).isRequired,
    classes: PropTypes.object.isRequired
};

export const MultiValue = withStyles(styles)(MultiValueCmp);

MultiValue.displayName = 'MultiValue';
