import React, {useRef} from 'react';
import {Grid, InputLabel, withStyles} from '@material-ui/core';
import {MoreVert, Public} from '@material-ui/icons';
import {Badge, IconButton} from '@jahia/design-system-kit';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import * as PropTypes from 'prop-types';
import {ContextualMenu} from '@jahia/react-material';
import {FieldPropTypes} from '../../../../../../FormDefinitions';
import {SiteInfoPropTypes} from '../../../../../../SiteData';
import {MultipleField} from './MultipleField';
import {SingleField} from './SingleField';

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
            paddingLeft: theme.spacing.unit * 4,
            width: '100%',
            padding: '8px 0'
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

export const FieldCmp = ({t, classes, inputContext, idInput, selectorType, field, siteInfo, actionContext}) => {
    const contextualMenu = useRef(null);

    return (
        <div className={classes.formControl}
             data-sel-content-editor-field={field.name}
             data-sel-content-editor-field-type={`${field.multiple ? 'Multiple' : ''}${selectorType.key}`}
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
                                        className={classes.inputLabel}
                                        htmlFor={idInput}
                            >
                                {field.displayName}
                            </InputLabel>
                            {(!field.i18n && siteInfo.languages.length > 1) &&
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
                            {(field.multiple && !selectorType.supportMultiple) ?
                                <MultipleField inputContext={inputContext} field={field}/> :
                                <SingleField inputContext={inputContext} field={field}/>
                            }
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
                                                aria-label={t('content-editor:label.contentEditor.edit.action.moreOptions')}
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
                </Grid>
            </Grid>
        </div>
    );
};

FieldCmp.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    inputContext: PropTypes.object.isRequired,
    idInput: PropTypes.string.isRequired,
    selectorType: PropTypes.shape({
        key: PropTypes.string,
        supportMultiple: PropTypes.bool
    }).isRequired,
    siteInfo: SiteInfoPropTypes.isRequired,
    field: FieldPropTypes.isRequired,
    actionContext: PropTypes.shape({
        noAction: PropTypes.bool
    }).isRequired
};

export const Field = compose(
    translate(),
    withStyles(styles)
)(FieldCmp);

Field.displayName = 'Field';
