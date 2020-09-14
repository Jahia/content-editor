import React from 'react';
import * as PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';

const StartWorkFlow = ({context, isMainButton, hasPublishPermission, hasStartPublicationWorkflowPermission, lockedAndCannotBeEdited, values, dirty, render: Render, loading: Loading}) => {
    let disabled = false;
    let enabled = true;
    let isVisible = true;

    if (isMainButton) {
        // Is Visible
        enabled = !hasPublishPermission && hasStartPublicationWorkflowPermission;

        // Is WIP
        const wipInfo = values[Constants.wip.fieldName];
        disabled = dirty ||
            wipInfo.status === Constants.wip.status.ALL_CONTENT ||
            (wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.includes(context.language));
    } else {
        // Is Visible
        isVisible = enabled && hasPublishPermission;

        // Is Active
        if (isVisible && (lockedAndCannotBeEdited || dirty)) {
            enabled = false;
        }
    }

    if (Loading) {
        return <Loading context={context}/>;
    }

    return (
        <Render
            context={{
                ...context,
                initStartWorkflow: true,
                enabled: enabled,
                disabled: disabled,
                isVisible: isVisible,
                onClick: context => {
                    if (context.enabled) {
                        window.authoringApi.openPublicationWorkflow(
                            [context.nodeData.uuid],
                            false, // Not publishing all subNodes (AKA sub pages)
                            false, // Not publishing all language
                            false // Not unpublish action
                        );
                    }
                }
            }}
        />
    );
};

StartWorkFlow.propTypes = {
    context: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    isMainButton: PropTypes.bool.isRequired,
    hasPublishPermission: PropTypes.bool.isRequired,
    hasStartPublicationWorkflowPermission: PropTypes.bool.isRequired,
    lockedAndCannotBeEdited: PropTypes.bool.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const startWorkFlowButtonAction = {
    component: StartWorkFlow
};

export default startWorkFlowButtonAction;
