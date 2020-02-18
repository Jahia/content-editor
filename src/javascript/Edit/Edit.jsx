import React from 'react';
import {withNotifications} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import * as PropTypes from 'prop-types';
import {useContentEditorContext, withContentEditorDataContextProvider} from '~/ContentEditor.context';
import {validate} from '~/Validation/validation';
import {saveNode} from './save/save.request';
import {PublicationInfoContextProvider} from '~/PublicationInfo/PublicationInfo.context';
import {registerEngineTabActions} from './engineTabs/engineTabs.utils';
import {LockedEditorContextProvider} from '~/Lock/LockedEditor.context';
import {useTranslation} from 'react-i18next';
import {FormQuery} from './EditForm.gql-queries';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';

export const EditCmp = ({
    client,
    notificationContext
}) => {
    const {t} = useTranslation();
    const {path, lang, nodeData, sections, formQueryParams, initialValues, title, site} = useContentEditorContext();

    // Engines tabs need the node Data to be registered
    registerEngineTabActions(nodeData, site, client);

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
