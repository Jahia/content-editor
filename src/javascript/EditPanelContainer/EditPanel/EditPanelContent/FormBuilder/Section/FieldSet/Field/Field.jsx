import React, {useRef, useState, useContext} from 'react';
import {FormControl, Grid, InputLabel, withStyles} from '@material-ui/core';
import {MoreVert, Public} from '@material-ui/icons';
import {Badge, IconButton} from '@jahia/design-system-kit';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import * as PropTypes from 'prop-types';
import {ContextualMenu} from '@jahia/react-material';
import {connect} from 'formik';
import {FieldPropTypes} from '../../../../FormDefinitions';
import {SiteInfoPropTypes} from '../../../../SiteData';

import {ContentEditorContext} from '../../../../ContentEditor.context';

let styles = theme => ({
    formControl: Object.assign(theme.typography.zeta, {
        padding: '8px 0',
        flexGrow: 1,
        transform: 'none!important',
        position: 'relative'
    }),
    inputLabel: {
        ...theme.typography.zeta,
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
});

export const EditNodeProperty = ({t, classes, field, siteInfo, labelHtmlFor, selectorType, formik, dxContext}) => {
    const contextualMenu = useRef(null);
    const [actionContext, _setActionContext] = useState({noAction: true});
    const editorContext = useContext(ContentEditorContext);

    const setActionContext = getNewActionContext => {
        const newActionContext = getNewActionContext(actionContext);
        if (newActionContext.contextHasChange) {
            _setActionContext({field, formik, dxContext, ...newActionContext});
        }
    };

    let FieldComponent = selectorType.cmp;

    return (
        <FormControl className={classes.formControl}
                     data-sel-content-editor-field={field.formDefinition.name}
                     data-sel-content-editor-field-type={`${field.formDefinition.multiple ? 'Multiple' : ''}${selectorType.key}`}
                     data-sel-content-editor-field-readonly={field.formDefinition.readOnly}
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
                                        className={classes.inputLabel}
                                        htmlFor={labelHtmlFor}
                                        style={(!field.formDefinition.i18n && siteInfo.languages.length > 1) ? {paddingTop: 24} : {}}
                            >
                                {field.formDefinition.displayName}
                            </InputLabel>
                            {(!field.formDefinition.i18n && siteInfo.languages.length > 1) &&
                            <Badge className={classes.badge}
                                   badgeContent={t('content-editor:label.contentEditor.edit.sharedLanguages')}
                                   icon={<Public/>}
                                   variant="normal"
                                   color="info"
                            />
                            }
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        wrap="nowrap"
                        direction="row"
                        alignItems="center"
                    >
                        <Grid item className={classes.input}>
                            <FieldComponent field={field}
                                            id={field.formDefinition.name}
                                            editorContext={editorContext}
                                            setActionContext={setActionContext}/>
                        </Grid>
                        <Grid item>
                            {actionContext.noAction ? (
                                <span className={classes.emptySpace}/>
                            ) : (
                                <>
                                    <ContextualMenu ref={contextualMenu}
                                                    actionKey={selectorType.key + 'Menu'}
                                                    context={actionContext}/>
                                    <IconButton variant="ghost"
                                                data-sel-action="moreOptions"
                                                aria-label={t('content-editor:label.contentEditor.edit.action.moreOptions')}
                                                icon={<MoreVert/>}
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    contextualMenu.current.open(event);
                                                }}/>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </FormControl>
    );
};

EditNodeProperty.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    siteInfo: SiteInfoPropTypes.isRequired,
    labelHtmlFor: PropTypes.string.isRequired,
    selectorType: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired,
    dxContext: PropTypes.object.isRequired
};

const EditNodePropertyCmp = compose(
    connect,
    translate(),
    withStyles(styles)
)(EditNodeProperty);

EditNodePropertyCmp.displayName = 'EditNodeProperty';

export default EditNodePropertyCmp;
