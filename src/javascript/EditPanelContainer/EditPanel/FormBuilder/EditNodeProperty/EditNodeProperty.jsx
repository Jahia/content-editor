import React from 'react';
import {FormControl, InputLabel, withStyles} from '@material-ui/core';
import {MoreVert} from '@material-ui/icons';
import {Button} from '@jahia/ds-mui-theme';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import * as PropTypes from 'prop-types';

let styles = theme => ({
    formControl: Object.assign(theme.typography.zeta, {
        width: '100%',
        padding: '16px 0',
        display: 'flex',
        flexDirection: 'row'
    }),
    inputLabel: {
        color: theme.palette.font.beta
    }
});

export const EditNodeProperty = ({classes, children, field}) => {
    return (
        <FormControl className={classes.formControl}>
            <InputLabel shrink className={classes.inputLabel}>
                {field.formDefinition.name}
            </InputLabel>
            {children}
            <Button><MoreVert/></Button>
        </FormControl>
    );
};

EditNodeProperty.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired
};

export default compose(
    translate(),
    withStyles(styles)
)(EditNodeProperty);

