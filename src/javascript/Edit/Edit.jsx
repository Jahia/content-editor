import React from 'react';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import * as PropTypes from 'prop-types';
import {useContentEditorContext, withContentEditorDataContextProvider} from '~/ContentEditor.context';
import {validate} from '~/Validation/validation';
import {saveNode} from './save/save.request';
import {PublicationInfoContextProvider} from '~/PublicationInfo/PublicationInfo.context';
import {LockedEditorContextProvider} from '~/Lock/LockedEditor.context';
import {useTranslation} from 'react-i18next';
import {FormQuery} from './EditForm.gql-queries';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import {useRegisterEngineTabActions} from '~/Edit/engineTabs/useRegisterEngineTabActions';
import envEditCallbacks from './Edit.env';

export const EditCmp = ({
    client,
    notificationContext
}) => {
    const {t} = useTranslation();
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {path, lang, nodeData, sections, formQueryParams, initialValues, title, site} = useContentEditorContext();

    // Engines tabs need the node Data to be registered
    const {loading, error} = useRegisterEngineTabActions(nodeData, site);

    if (error) {
        const message = t(
            'content-media-manager:label.contentManager.error.queryingContent',
            {details: error.message ? error.message : ''}
        );
        return <>{message}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const handleSubmit = (values, actions) => {
        saveNode({
            client,
            t,
            notificationContext,
            actions,
            data: {
                ...formQueryParams,
                nodeData,
                sections,
                values
            },
            editCallback: () => {
                const envEditCallback = envEditCallbacks[contentEditorConfigContext.env];
                if (envEditCallback) {
                    envEditCallback(contentEditorConfigContext);
                }
            }
        });
    };

    const editWithFormik = (
        <PublicationInfoContextProvider path={path} lang={lang}>
            <Formik
                initialValues={initialValues}
                render={props => <EditPanel {...props} title={title}/>}
                validate={validate(sections)}
                onSubmit={handleSubmit}
            />
        </PublicationInfoContextProvider>
    );
    return (
        <>
            {nodeData.lockedAndCannotBeEdited ? <>{editWithFormik}</> :
            <LockedEditorContextProvider path={path}>
                {editWithFormik}
            </LockedEditorContextProvider>}
        </>
    );
};

EditCmp.propTypes = {
    client: PropTypes.object.isRequired,
    notificationContext: PropTypes.object.isRequired
};

export const Edit = compose(
    withApollo,
    withNotifications(),
    withContentEditorDataContextProvider(FormQuery)
)(EditCmp);
Edit.displayName = 'Edit';
export default Edit;
