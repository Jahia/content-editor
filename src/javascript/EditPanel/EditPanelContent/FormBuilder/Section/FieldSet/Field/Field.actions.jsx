import {ContextualMenu, registry} from '@jahia/ui-extender';
import {IconButton} from '@jahia/design-system-kit';
import {MoreVert} from '@material-ui/icons';
import React, {useRef} from 'react';
import * as PropTypes from 'prop-types';
import {connect} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';
import {compose} from '~/utils';
import {withStyles} from '@material-ui/core';
import {useTranslation} from 'react-i18next';

let styles = () => ({
    emptySpace: {
        display: 'block',
        width: 48
    }
});

export const FieldActionsCmp = ({classes, inputContext, selectorType, field, formik}) => {
    const {t} = useTranslation();
    const contextualMenu = useRef(null);

    let actionCmp;
    if (inputContext.actionRender) {
        actionCmp = inputContext.actionRender;
    } else {
        // Check for registered menu action for selector type
        const menuAction = registry.get('action', selectorType.key + 'Menu');
        if (menuAction === undefined || (menuAction.displayFieldActions && !menuAction.displayFieldActions(field, formik.values[field.name]))) {
            actionCmp = <span className={classes.emptySpace}/>;
        } else {
            actionCmp = (
                <>
                    <ContextualMenu setOpenRef={contextualMenu}
                                    actionKey={selectorType.key + 'Menu'}
                                    field={field}
                                    formik={formik}
                    />
                    <IconButton variant="ghost"
                                data-sel-action="moreOptions"
                                aria-label={t('content-editor:label.contentEditor.edit.action.fieldMoreOptions')}
                                icon={<MoreVert/>}
                                onClick={event => {
                                    event.stopPropagation();
                                    const actionContext = registry.get('selectorType.actionContext', field.name);
                                    contextualMenu.current(event, {field, formik, ...actionContext});
                                }}
                    />
                </>
            );
        }
    }

    return (
        <>
            {actionCmp}
        </>
    );
};

FieldActionsCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    inputContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    selectorType: PropTypes.shape({
        key: PropTypes.string
    }).isRequired
};

export const FieldActions = compose(
    withStyles(styles),
    connect
)(FieldActionsCmp);

FieldActions.displayName = 'FieldActions';
