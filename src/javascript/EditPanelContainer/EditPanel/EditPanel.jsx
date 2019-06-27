import React, {useEffect, useContext} from 'react';
import {MainLayout} from '@jahia/design-system-kit';
import {buttonRenderer, DisplayActions} from '@jahia/react-material';
import {Typography} from '@jahia/design-system-kit';
import PropTypes from 'prop-types';
import EditPanelContent from './EditPanelContent/EditPanelContent';
import {connect} from 'formik';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import {ContentEditorContext} from '../ContentEditor.context';

const EditPanel = ({t, fields, title, siteInfo, nodeData, formik}) => {
    const editorContext = useContext(ContentEditorContext);

    useEffect(() => {
        const handleBeforeUnloadEvent = ev => {
            if (formik.dirty) {
                ev.preventDefault();
                ev.returnValue = '';
            }
        };

        // Prevent close browser's tab when there is unsaved content
        window.addEventListener('beforeunload', handleBeforeUnloadEvent);
        return () => {
            window.removeEventListener(
                'beforeunload',
                handleBeforeUnloadEvent
            );
        };
    }, [formik.dirty]);

    return (
        <MainLayout
            topBarProps={{
                path: <DisplayActions context={{nodeData, siteInfo}}
                                      target="editHeaderPathActions"
                                      render={({context}) => {
                                          const Button = buttonRenderer({variant: 'ghost', color: 'inverted'}, true);
                                          return <Button context={context}/>;
                                      }}
                />,
                title: title,
                contextModifiers: (
                    <Typography variant="omega" color="invert">
                        {t('content-editor:label.contentEditor.edit.title')}
                    </Typography>
                ),
                actions: (
                    <DisplayActions
                        context={{nodeData}}
                        target="editHeaderActions"
                        render={({context}) => {
                            const Button = buttonRenderer({variant: 'primary'}, true, null, true);
                            return <Button context={context}/>;
                        }}
                    />
                )
            }}
        >
            <EditPanelContent
                editorContext={editorContext}
                siteInfo={siteInfo}
                fields={fields}
            />
        </MainLayout>
    );
};

EditPanel.defaultProps = {
    title: ''
};

EditPanel.propTypes = {
    title: PropTypes.string,
    t: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    formik: PropTypes.object.isRequired,
    siteInfo: PropTypes.object.isRequired,
    nodeData: PropTypes.shape({
        aggregatedPublicationInfo: PropTypes.shape({
            publicationStatus: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

const EditPanelCmp = compose(
    translate(),
    connect
)(EditPanel);

EditPanelCmp.displayName = 'EditPanel';

export default EditPanelCmp;
