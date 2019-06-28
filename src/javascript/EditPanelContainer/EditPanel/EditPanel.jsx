import React, {useEffect, useContext} from 'react';
import {Badge, MainLayout} from '@jahia/design-system-kit';
import {buttonRenderer, DisplayActions} from '@jahia/react-material';
import PropTypes from 'prop-types';
import EditPanelContent from './EditPanelContent/EditPanelContent';
import {connect} from 'formik';
import {ContentEditorContext} from '../ContentEditor.context';

const EditPanel = ({fields, siteInfo, nodeData, formik}) => {
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
                title: nodeData.displayName,
                contextModifiers: (
                    <Badge badgeContent={nodeData.primaryNodeType.displayName}
                           variant="normal"
                           color="ghost"
                    />
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

EditPanel.propTypes = {
    fields: PropTypes.array.isRequired,
    formik: PropTypes.object.isRequired,
    siteInfo: PropTypes.object.isRequired,
    nodeData: PropTypes.shape({
        aggregatedPublicationInfo: PropTypes.shape({
            publicationStatus: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

const EditPanelCmp = connect(EditPanel);

EditPanelCmp.displayName = 'EditPanel';

export default EditPanelCmp;
