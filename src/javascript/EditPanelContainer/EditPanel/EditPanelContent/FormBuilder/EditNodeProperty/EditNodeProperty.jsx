import React, {useRef, useState} from 'react';
import {FormControl, Grid, InputLabel, withStyles} from '@material-ui/core';
import {MoreVert, Public} from '@material-ui/icons';
import {Badge, Button} from '@jahia/design-system-kit';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import * as PropTypes from 'prop-types';
import {ContextualMenu} from '@jahia/react-material';

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

export const EditNodeProperty = ({t, classes, field, siteInfo, labelHtmlFor, selectorType, editorContext}) => {
    const contextualMenu = useRef(null);
    const [actionContext, _setActionContext] = useState({noAction: true});

    const setActionContext = newActionContext => {
        if ((actionContext.noAction && !newActionContext.noAction) ||
            (!actionContext.noAction && newActionContext.noAction)) {
            _setActionContext(newActionContext);
        }
    };

    let FieldComponent = selectorType.cmp;

    return (
        <FormControl className={classes.formControl}
                     data-sel-content-editor-field={field.formDefinition.name}
                     data-sel-content-editor-field-type={selectorType.key}
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
                        {field.formDefinition.displayName}
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
                    <FieldComponent field={field} id={field.formDefinition.name} editorContext={editorContext} setActionContext={setActionContext}/>
                </Grid>
                <Grid item>
                    {!actionContext.noAction &&
                    <>
                        <ContextualMenu ref={contextualMenu} actionKey={selectorType.key + 'Menu'} context={actionContext}/>
                        <Button variant="ghost"
                                icon={<MoreVert/>}
                                onClick={event => {
                                    event.stopPropagation();
                                    contextualMenu.current.open(event);
                                }
                        }/>
                    </>
                    }
                </Grid>
            </Grid>
        </FormControl>
    );
};

EditNodeProperty.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    siteInfo: PropTypes.object.isRequired,
    labelHtmlFor: PropTypes.string.isRequired,
    selectorType: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired
};

export default compose(
    translate(),
    withStyles(styles)
)(EditNodeProperty);
