import React, {useRef} from 'react';
import {Grid, InputLabel, withStyles} from '@material-ui/core';
import {Typography} from '@jahia/design-system-kit';
import {MoreVert, Public} from '@material-ui/icons';
import {Badge, IconButton} from '@jahia/design-system-kit';
import {useTranslation} from 'react-i18next';
import * as PropTypes from 'prop-types';
import {ContextualMenu} from '@jahia/ui-extender';
import {FieldPropTypes} from '~/FormDefinitions';
import {MultipleField} from './MultipleField';
import {SingleField} from './SingleField';
import {showChipField} from '~/EditPanel/WorkInProgress/WorkInProgress.utils';

let styles = theme => {
    const common = {
        flexGrow: 1,
        transform: 'none!important',
        position: 'relative',
        marginBottom: theme.spacing.unit
    };

    return {
        formControl: {
            ...theme.typography.zeta,
            ...common,
            padding: '8px 0',
            paddingLeft: '8px',
            marginLeft: '20px ',
            borderLeft: '4px solid transparent'
        },
        formControlError: {
            borderLeft: `4px solid ${theme.palette.support.gamma}`
        },
        errorMessage: {
            marginTop: '4px',
            color: theme.palette.support.delta
        },
        inputLabel: {
            ...theme.typography.zeta,
            ...common,
            color: theme.palette.font.beta,
            display: 'inline-block'
        },
        emptySpace: {
            display: 'block',
            width: 48
        },
        input: {
            flexGrow: 5
        },
        badge: {
            marginBottom: theme.spacing.unit,
            position: 'sticky'
        }
    };
};

export const FieldCmp = ({classes, inputContext, idInput, selectorType, field, siteInfo, actionContext, formik: {errors, touched}}) => {
    const {t} = useTranslation();
    const contextualMenu = useRef(null);
    const isMultipleField = field.multiple && !selectorType.supportMultiple;
    const seleniumFieldType = isMultipleField ? `GenericMultipleField${selectorType.key}` : (field.multiple ? `Multiple${selectorType.key}` : selectorType.key);

    const shouldDisplayErrors = touched[field.name] && errors[field.name];
    const hasMandatoryError = shouldDisplayErrors && errors[field.name] === 'required';
    return (
        <div className={`${classes.formControl} ${shouldDisplayErrors ? classes.formControlError : ''}`}
             data-sel-content-editor-field={field.name}
             data-sel-content-editor-field-type={seleniumFieldType}
             data-sel-content-editor-field-readonly={field.readOnly}
        >
            <Grid
                container
                wrap="nowrap"
                direction="row"
                alignItems="center"
            >
                <Grid item className={classes.input}>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid item>
                            <InputLabel shrink
                                        id={`${field.name}-label`}
                                        className={classes.inputLabel}
                                        htmlFor={isMultipleField ? null : idInput}
                            >
                                {field.displayName}
                            </InputLabel>
                            {field.mandatory && (
                                <Badge className={classes.badge}
                                       data-sel-content-editor-field-mandatory={Boolean(hasMandatoryError)}
                                       badgeContent={t('content-editor:label.contentEditor.edit.validation.required')}
                                       variant="normal"
                                       color={hasMandatoryError ? 'warning' : 'primary'}
                                />
                            )}
                            {showChipField(field.i18n, inputContext.editorContext.nodeData.wipInfo, inputContext.editorContext.lang) && (
                                <Badge className={classes.badge}
                                       data-sel-role="wip-info-chip-field"
                                       badgeContent={t('content-editor:label.contentEditor.edit.action.workInProgress.chipLabelField')}
                                       variant="normal"
                                       color="info"
                                />
                            )}
                            {(!field.i18n && siteInfo.languages.length > 1) &&
                            <Badge className={classes.badge}
                                   badgeContent={t('content-editor:label.contentEditor.edit.sharedLanguages')}
                                   icon={<Public/>}
                                   variant="normal"
                                   color="info"
                            />}
                        </Grid>
                    </Grid>
                    {field.description &&
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid item>
                            <Typography color="beta" variant="omega">
                                {field.description}
                            </Typography>
                        </Grid>
                    </Grid>}
                    <Grid
                        container
                        wrap="nowrap"
                        direction="row"
                        alignItems="center"
                    >
                        <Grid item className={classes.input}>
                            {isMultipleField ?
                                <MultipleField inputContext={inputContext} field={field}/> :
                                <SingleField inputContext={inputContext} field={field}/>}
                        </Grid>
                        <Grid item>
                            {actionContext.noAction ? (
                                <span className={classes.emptySpace}/>
                            ) : (
                                <>
                                    <ContextualMenu ref={contextualMenu}
                                                    actionKey={selectorType.key + 'Menu'}
                                                    context={actionContext}
                                    />
                                    <IconButton variant="ghost"
                                                data-sel-action="moreOptions"
                                                aria-label={t('content-editor:label.contentEditor.edit.action.fieldMoreOptions')}
                                                icon={<MoreVert/>}
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    contextualMenu.current.open(event);
                                                }}
                                    />
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Typography className={classes.errorMessage}>
                        {shouldDisplayErrors ?
                            field.errorMessage ?
                                field.errorMessage :
                                t(`content-editor:label.contentEditor.edit.errors.${errors[field.name]}`) :
                            ''}&nbsp;
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};

FieldCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    inputContext: PropTypes.object.isRequired,
    idInput: PropTypes.string.isRequired,
    selectorType: PropTypes.shape({
        key: PropTypes.string,
        supportMultiple: PropTypes.bool
    }).isRequired,
    siteInfo: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.shape({
        errors: PropTypes.object,
        touched: PropTypes.object
    }).isRequired,
    actionContext: PropTypes.shape({
        noAction: PropTypes.bool
    }).isRequired
};

export const Field = withStyles(styles)(FieldCmp);
Field.displayName = 'Field';
