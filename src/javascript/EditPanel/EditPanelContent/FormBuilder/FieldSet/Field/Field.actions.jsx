import {ContextualMenu, DisplayAction, registry} from '@jahia/ui-extender';
import React, {useRef} from 'react';
import * as PropTypes from 'prop-types';
import {connect} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';
import {compose} from '~/utils';
import {withStyles} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {Button, MoreVert} from "@jahia/moonstone";

let styles = () => ({
    emptySpace: {
        display: 'block',
        width: 48
    }
});

export const FieldActionsCmp = ({classes, inputContext, selectorType, field, formik}) => {
    const {t} = useTranslation('content-editor');
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
                <DisplayAction
                    actionKey={selectorType.key + 'Menu'} formik={formik} field={field} selectorType={selectorType}
                    render={({dataSelRole, isVisible, enabled, isDisabled, buttonIcon, onClick, ...props}) => {
                        return isVisible && (
                            <Button
                                data-sel-role={dataSelRole}
                                icon={buttonIcon}
                                variant="ghost"
                                onClick={e => {
                                    e.stopPropagation();
                                    onClick(props, e);
                                }}
                            />
                        )
                    }}
                />
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
