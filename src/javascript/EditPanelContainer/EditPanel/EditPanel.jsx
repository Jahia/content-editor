import React, {useEffect} from 'react';
import {Badge, MainLayout} from '@jahia/design-system-kit';
import {buttonRenderer, DisplayActions} from '@jahia/react-material';
import PropTypes from 'prop-types';
import EditPanelContent from './EditPanelContent/EditPanelContent';
import {connect} from 'formik';
import {EditPanelLanguageSwitcher} from './EditPanelLanguageSwitcher';
import {FieldsPropTypes, NodeDataPropTypes} from '../FormDefinitions';
import {SiteInfoPropTypes} from '../SiteData';

const EditPanel = ({fields, siteInfo, nodeData, lang, formik}) => {
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
            <EditPanelContent siteInfo={siteInfo}
                              fields={fields}
                              isDirty={formik.dirty}
            />
        </MainLayout>
    );
};

EditPanel.propTypes = {
    fields: FieldsPropTypes.isRequired,
    siteInfo: SiteInfoPropTypes.isRequired,
    nodeData: NodeDataPropTypes.isRequired,
    lang: PropTypes.string.isRequired,
    formik: PropTypes.object.isRequired
};

EditPanel.displayName = 'EditPanel';

export default connect(EditPanel);
