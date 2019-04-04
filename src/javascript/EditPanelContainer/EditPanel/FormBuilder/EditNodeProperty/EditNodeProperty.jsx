import React from 'react';
import {FormControl, InputLabel, withStyles, Grid} from '@material-ui/core';
import {MoreVert, Public} from '@material-ui/icons';
import {Button, Badge} from '@jahia/ds-mui-theme';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import * as PropTypes from 'prop-types';

let styles = theme => ({
    formControl: Object.assign(theme.typography.zeta, {
        padding: '16px 0',
        flexGrow: 1
    }),
    inputLabel: {
        color: theme.palette.font.beta
    },
    input: {
        flexGrow: 5
    },
    badge: {
        marginBottom: theme.spacing.unit,
        marginRight: 84
    }
});

export const EditNodeProperty = ({t, classes, children, field, siteInfo}) => {
    return (
        <FormControl className={classes.formControl} data-sel-content-editor-field={field.formDefinition.name} data-sel-content-editor-field-type={field.formDefinition.selectorType}>
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
            >
                <Grid item>
                    <InputLabel shrink
                                className={classes.inputLabel}
                                style={(!field.formDefinition.i18n && siteInfo.languages.length > 1) ? {paddingTop: 32} : {}}
                    >
                        {field.formDefinition.name}
                    </InputLabel>
                </Grid>

                {(!field.formDefinition.i18n && siteInfo.languages.length > 1) &&
                <Grid item>
                    <Badge className={classes.badge}
                           badgeContent={t('content-editor:label.contentEditor.edit.sharedLanguages')}
                           icon={<Public/>}
                           variant="normal"
                           color="warning"
                    />
                </Grid>
                }
            </Grid>

            <Grid
                container
                direction="row"
                alignItems="center"
            >
                <Grid item className={classes.input}>
                    {children}
                </Grid>
                <Grid item>
                    <Button variant="iconGhost" icon={<MoreVert/>}/>
                </Grid>
            </Grid>
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
