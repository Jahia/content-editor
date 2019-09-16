import React, {useEffect} from 'react';
import {Badge, MainLayout} from '@jahia/design-system-kit';
import {buttonRenderer, DisplayActions} from '@jahia/react-material';
import PropTypes from 'prop-types';
import EditPanelContent from './EditPanelContent/EditPanelContent';
import {connect} from 'formik';
import {EditPanelLanguageSwitcher} from './EditPanelLanguageSwitcher';
import {useContentEditorContext} from '../../ContentEditor.context';

const EditPanelCmp = ({formik, title}) => {
    const {nodeData, siteInfo, lang} = useContentEditorContext();

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
        <form>
            <MainLayout
            topBarProps={{
                path: <DisplayActions context={{nodeData, siteInfo}}
                                      target="editHeaderPathActions"
                                      render={({context}) => {
                                          const Button = buttonRenderer({variant: 'ghost', color: 'inverted'}, true);
                                          return <Button context={context}/>;
                                      }}
                />,
                title,
                contextModifiers: (
                    <>
                        <EditPanelLanguageSwitcher lang={lang}
                                                   siteInfo={siteInfo}
                        />

                        <Badge badgeContent={nodeData.primaryNodeType.displayName}
                               variant="normal"
                               color="ghost"
                        />
                    </>
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
                <EditPanelContent isDirty={formik.dirty}/>
            </MainLayout>
        </form>
    );
};

EditPanelCmp.propTypes = {
    formik: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
};

const EditPanel = connect(EditPanelCmp);
EditPanel.displayName = 'EditPanel';
export default EditPanel;
