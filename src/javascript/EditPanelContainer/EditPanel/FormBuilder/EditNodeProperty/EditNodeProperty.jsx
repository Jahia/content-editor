import React from 'react';
import {FormControl, InputLabel, withStyles} from '@material-ui/core';
import {MoreVert, Public} from '@material-ui/icons';
import {Button, Chip} from '@jahia/ds-mui-theme';
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

export const EditNodeProperty = ({t, classes, children, field, siteInfo}) => {
    return (
        <FormControl className={classes.formControl}>
            <InputLabel shrink className={classes.inputLabel}>
                {field.formDefinition.name}
            </InputLabel>

            {(!field.formDefinition.i18n && siteInfo.languages.length > 1) &&
                <Chip icon={<Public/>} label={t('content-editor:label.contentEditor.edit.sharedLanguages')} size="compact"/>}

            {children}
            <Button><MoreVert/></Button>
        </FormControl>
    );
};

EditNodeProperty.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    siteInfo: PropTypes.object.isRequired
};

export default compose(
    translate(),
    withStyles(styles)
)(EditNodeProperty);

