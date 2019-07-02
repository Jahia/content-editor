import React, {useEffect} from 'react';
import {Badge, LanguageSwitcher, MainLayout} from '@jahia/design-system-kit';
import {buttonRenderer, DisplayActions} from '@jahia/react-material';
import PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {cmGoto} from '../../ContentManager.redux-actions';
import EditPanelContent from './EditPanelContent/EditPanelContent';
import {connect} from 'formik';
import {connect as connectReactRedux} from 'react-redux';

const EditPanel = ({fields, siteInfo, nodeData, lang, formik, onSelectLanguage}) => {
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
                        <LanguageSwitcher lang={lang}
                                          languages={siteInfo.languages}
                                          color="inverted"
                                          onSelectLanguage={onSelectLanguage}
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
            <EditPanelContent
                siteInfo={siteInfo}
                fields={fields}
            />
        </MainLayout>
    );
};

const mapStateToProps = state => ({
    lang: state.language
});

const mapDispatchToProps = dispatch => ({
    onSelectLanguage: language => {
        dispatch(cmGoto({language}));
    }
});

EditPanel.propTypes = {
    fields: PropTypes.array.isRequired,
    formik: PropTypes.object.isRequired,
    siteInfo: PropTypes.object.isRequired,
    nodeData: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        primaryNodeType: PropTypes.shape({
            displayName: PropTypes.string
        }),
        aggregatedPublicationInfo: PropTypes.shape({
            publicationStatus: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    lang: PropTypes.string.isRequired,
    onSelectLanguage: PropTypes.func.isRequired
};

const EditPanelCmp = compose(
    connect,
    connectReactRedux(mapStateToProps, mapDispatchToProps)
)(EditPanel);

EditPanelCmp.displayName = 'EditPanel';

export default EditPanelCmp;
