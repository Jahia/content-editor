import React from 'react';
import * as PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorContext} from '~/ContentEditor.context';
import {useFormikContext} from 'formik';

const StartWorkFlow = ({isMainButton, render: Render, loading: Loading, ...otherProps}) => {
    const {nodeData, lang, i18nContext} = useContentEditorContext();
    const {hasPublishPermission, hasStartPublicationWorkflowPermission, lockedAndCannotBeEdited} = nodeData;

    const formik = useFormikContext();

    let disabled = false;
    let isVisible;
    const dirty = formik.dirty || Object.keys(i18nContext).length > 0;

    if (isMainButton) {
        // Is Visible
        isVisible = !hasPublishPermission && hasStartPublicationWorkflowPermission;

        // Is WIP
        const wipInfo = formik.values[Constants.wip.fieldName];

        disabled = dirty ||
            wipInfo.status === Constants.wip.status.ALL_CONTENT ||
            (wipInfo.status === Constants.wip.status.LANGUAGES && wipInfo.languages.includes(lang));
    } else {
        // Is Visible
        isVisible = hasPublishPermission;

        // Is Active
        if (isVisible && (lockedAndCannotBeEdited || dirty)) {
            disabled = true;
        }
    }

    if (Loading) {
        return <Loading {...otherProps}/>;
    }

    return (
        <Render {...otherProps}
                initStartWorkflow
                disabled={disabled}
                isVisible={isVisible}
                onClick={context => {
                    if (context.enabled) {
                        window.authoringApi.openPublicationWorkflow(
                            [nodeData.uuid],
                            false, // Not publishing all subNodes (AKA sub pages)
                            false, // Not publishing all language
                            false // Not unpublish action
                        );
                    }
                }}
        />
    );
};

StartWorkFlow.propTypes = {
    isMainButton: PropTypes.bool.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

const startWorkFlowButtonAction = {
    component: StartWorkFlow
};

export default startWorkFlowButtonAction;
