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

export const EditNodeProperty = ({t, classes, children, field, siteInfo, labelHtmlFor}) => {
    // Todo improve selenium detection of the field type
    let seleniumType = children.type.name;
    if (children.type.WrappedComponent) {
        seleniumType = children.type.WrappedComponent.name;
    }

    if (children.type.Naked) {
        seleniumType = children.type.Naked.name;
    }

    return (
        <FormControl className={classes.formControl}
                     data-sel-content-editor-field={field.formDefinition.name}
                     data-sel-content-editor-field-type={seleniumType}
        >
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
            >
                <Grid item>
                    <InputLabel shrink
                                className={classes.inputLabel}
                                htmlFor={labelHtmlFor}
                                style={(!field.formDefinition.i18n && siteInfo.languages.length > 1) ? {paddingTop: 32} : {}}
                    >
                        {field.formDefinition.nodeType.properties.find(property => property.name === field.formDefinition.name).displayName}
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
                wrap="nowrap"
                direction="row"
                alignItems="center"
            >
                <Grid item className={classes.input}>
                    {children}
                </Grid>
                <Grid item>
                    <Button variant="ghost" icon={<MoreVert/>}/>
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
    siteInfo: PropTypes.object.isRequired,
    labelHtmlFor: PropTypes.string.isRequired
};

export default compose(
    translate(),
    withStyles(styles)
)(EditNodeProperty);
