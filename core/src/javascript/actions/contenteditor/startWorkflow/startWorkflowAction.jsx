import React from 'react';
import * as PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorContext} from '~/contexts/ContentEditor';
import {useFormikContext} from 'formik';
import {isDirty} from '~/utils';

const StartWorkFlow = ({isMainButton, render: Render, loading: Loading, ...otherProps}) => {
    const {nodeData, lang, i18nContext, siteInfo} = useContentEditorContext();
    const {hasPublishPermission, hasStartPublicationWorkflowPermission, lockedAndCannotBeEdited} = nodeData;

    const formik = useFormikContext();

    let disabled = false;
    let isVisible;
    const dirty = isDirty(formik, i18nContext);

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
                buttonLabelParams={{language: lang}}
                // Do not display language in request publication button if there is only one language
                buttonLabelShort={(siteInfo?.languages.length > 1) ?
                    '' : 'content-editor:label.contentEditor.edit.action.startWorkflow.shortName'}
                onClick={() => {
                    window.authoringApi.openPublicationWorkflow(
                        [nodeData.uuid],
                        false, // Not publishing all subNodes (AKA sub pages)
                        false, // Not publishing all language
                        false // Not unpublish action
                    );
                }}
        />
    );
};

StartWorkFlow.propTypes = {
    isMainButton: PropTypes.bool.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

export const startWorkflowAction = {
    component: StartWorkFlow
};
