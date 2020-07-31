import React from 'react';
import {withNotifications} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import * as PropTypes from 'prop-types';
import {useContentEditorContext, withContentEditorDataContextProvider} from '~/ContentEditor.context';
import {validate} from '~/Validation/validation';
import {saveNode} from './save/save.request';
import {PublicationInfoContextProvider} from '~/PublicationInfo/PublicationInfo.context';
import {LockManager} from '~/Lock/LockManager';
import {useTranslation} from 'react-i18next';
import {FormQuery} from './EditForm.gql-queries';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {useContentEditorConfigContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';

import envEditCallbacks from './Edit.env';
import {adaptEditFormData} from './Edit.adapter';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorHistoryContext} from '~/ContentEditorHistory/ContentEditorHistory.context';
import {useDispatch, useSelector} from 'react-redux';
import {replaceOpenedPath} from '~/JContent.redux-actions';

export const EditCmp = ({
    client,
    notificationContext
}) => {
    const {t} = useTranslation();
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {path, lang, nodeData, formQueryParams, initialValues, title} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const {storedLocation, setStoredLocation} = useContentEditorHistoryContext();
    const {openPaths} = useSelector(state => ({openPaths: state.jcontent.openPaths}));
    const dispatch = useDispatch();

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
            editCallback: (node, mutateNode) => {
                if (values[Constants.systemFields.OVERRIDE_SUBMIT_CALLBACK]) {
                    values[Constants.systemFields.OVERRIDE_SUBMIT_CALLBACK]();
                } else {
                    const envEditCallback = envEditCallbacks[contentEditorConfigContext.env];
                    if (envEditCallback) {
                        envEditCallback(node.uuid, contentEditorConfigContext);
                    }
                }

                if (mutateNode.rename) {
                    if (storedLocation && storedLocation.location) {
                        const newNameStartPosition = mutateNode.rename.lastIndexOf('/') + 1;
                        const newName = mutateNode.rename.substring(newNameStartPosition, mutateNode.rename.length);
                        if (openPaths) {
                            dispatch(replaceOpenedPath(openPaths.map(openPath => openPath.replace(node.name, newName))));
                        }

                        setStoredLocation({
                            ...storedLocation,
                            location: {
                                ...storedLocation.location,
                                pathname: storedLocation.location.pathname.replace(node.name, newName)
                            }
                        });
                    }
                }

                // Hard reFetch to be able to enable publication menu from jContent menu displayed in header
                client.reFetchObservableQueries();
            }
        });
    };

    return (
        <>
            <PublicationInfoContextProvider uuid={nodeData.uuid} lang={lang}>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    render={props => <EditPanel {...props} title={title}/>}
                    validate={validate(sections)}
                    onSubmit={handleSubmit}
                />
            </PublicationInfoContextProvider>
            {!nodeData.lockedAndCannotBeEdited && <LockManager path={path}/>}
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
    withContentEditorDataContextProvider(FormQuery, adaptEditFormData)
)(EditCmp);
Edit.displayName = 'Edit';
export default Edit;
