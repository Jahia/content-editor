import React/* , {useRef} */ from 'react';
import {FormControl, Grid, InputLabel, withStyles} from '@material-ui/core';
import {Public} from '@material-ui/icons';
import {Badge/* , IconButton */} from '@jahia/design-system-kit';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import * as PropTypes from 'prop-types';
// Import {ContextualMenu} from '@jahia/react-material';
import {FieldPropTypes} from '../../../../../../FormDefinitions';
import {SiteInfoPropTypes} from '../../../../../../SiteData';

let styles = theme => ({
    formControl: Object.assign(theme.typography.zeta, {
        padding: '8px 0',
        flexGrow: 1,
        transform: 'none!important',
        position: 'relative',
        margin: `0 ${theme.spacing.unit * 4}px`,
        marginBottom: theme.spacing.unit * 3,
        width: '100%'
    }),
    inputLabel: {
        ...theme.typography.zeta,
        margin: 0,
        width: 'auto',
        padding: 0,
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

export const FieldCmp = ({t, classes, input, idInput, selectorType, field, siteInfo, actionContext}) => {
    // Const contextualMenu = useRef(null);

    return (
        <FormControl className={classes.formControl}
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
                            {input}
                        </Grid>
                        <Grid item>
                            {actionContext.noAction ? (
                                <span className={classes.emptySpace}/>
                            ) : (
                                <>
                                    {/*
                                        // TODO BACKLOG-10753
                                    FIXME in next PR !!
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
                                            */}
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </FormControl>
    );
};

FieldCmp.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,

    input: PropTypes.element.isRequired,
    idInput: PropTypes.string.isRequired,
    selectorType: PropTypes.shape({
        key: PropTypes.string
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
