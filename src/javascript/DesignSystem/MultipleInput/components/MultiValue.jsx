import React from 'react';
import PropTypes from 'prop-types';

import {Chip} from '@jahia/design-system-kit';

import {withStyles} from '@material-ui/core';

const styles = theme => ({
    chipReadOnly: {
        backgroundColor: theme.palette.ui.delta,
        color: theme.palette.invert.beta
    },
    chipFocused: {
        backgroundColor: theme.palette.ui.alpha,
        color: theme.palette.ui.delta
    }
});

export const MultiValueCmp = ({data, removeProps, selectProps, classes, components, isFocused, ...other}) => {
    const {Container, Remove} = components;

    return (
        <Container data={data} selectProps={selectProps}>
            <Chip
                tabIndex="-1"
                label={data.label}
                className={`${isFocused ? classes.chipFocused : ''} ${other.isDisabled ? classes.chipReadOnly : ''}`}
                deleteIcon={<Remove {...removeProps}/>}
                variant={other.isDisabled ? 'secondary' : 'primary'}
                onDelete={other.isDisabled ? null : removeProps.onClick}
            />
        </Container>
    );
};

MultiValueCmp.propTypes = {
    data: PropTypes.shape({
        label: PropTypes.string
    }).isRequired,
    removeProps: PropTypes.object.isRequired,
    selectProps: PropTypes.object.isRequired,
    isFocused: PropTypes.bool.isRequired,
    components: PropTypes.shape({
        Container: PropTypes.any.isRequired,
        Remove: PropTypes.any.isRequired
    }),
    classes: PropTypes.object.isRequired
};

export const MultiValue = withStyles(styles)(MultiValueCmp);

MultiValue.displayName = 'MultiValue';
