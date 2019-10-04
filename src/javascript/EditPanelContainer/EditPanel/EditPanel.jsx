import React, {useEffect, useRef} from 'react';
import {Badge, MainLayout, IconButton} from '@jahia/design-system-kit';
import {buttonRenderer, DisplayActions, ContextualMenu} from '@jahia/react-material';
import PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import EditPanelContent from './EditPanelContent/EditPanelContent';
import {connect} from 'formik';
import {EditPanelLanguageSwitcher} from './EditPanelLanguageSwitcher';
import {MoreVert, Error} from '@material-ui/icons';
import {useContentEditorContext} from '~/ContentEditor.context';
import {withStyles} from '@material-ui/core';

const styles = theme => ({
    actionButtonHeaderContainer: {
        position: 'relative'
    },
    warningBadge: {
        position: 'absolute',
        top: '-0.5em',
        right: 0,
        backgroundColor: theme.palette.layout.dark,
        borderRadius: '50%',
        color: theme.palette.support.gamma
    }
});

const EditPanelCmp = ({formik, title, classes}) => {
    const {nodeData, siteInfo, lang} = useContentEditorContext();
    const contentEditorHeaderMenu = useRef(null);

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
                    <>
                        <DisplayActions
                            context={{nodeData}}
                            target="editHeaderActions"
                            render={({context}) => {
                                const Button = buttonRenderer({
                                    variant: 'primary',
                                    disabled: context.disabled
                                }, true, null, true);

                                    return (
                                        <div className={classes.actionButtonHeaderContainer}>
                                            <Button disabled context={context}/>
                                            {context.addWarningBadge && (
                                                <Error data-sel-role={`${context.actionKey}_pastille`} className={classes.warningBadge}/>
                                            )}
                                        </div>
                                    );
                                }}
                            />
                        <ContextualMenu
                            ref={contentEditorHeaderMenu}
                            context={{nodeData, formik}}
                            actionKey="ContentEditorHeaderMenu"
                            />
                        <IconButton data-sel-action="moreActions"
                                    aria-label="t(content-editor:label.contentEditor.edit.action.fieldMoreOptions)"
                                    icon={<MoreVert/>}
                                    color="inverted"
                                    onClick={event => {
                                            event.stopPropagation();
                                            contentEditorHeaderMenu.current.open(event);
                                        }}
                                    />
                    </>
                )
            }}
        >
            <EditPanelContent isDirty={formik.dirty}/>
        </MainLayout>
    );
};

EditPanelCmp.propTypes = {
    formik: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
};

const EditPanel = compose(
    connect,
    withStyles(styles)
)(EditPanelCmp);
EditPanel.displayName = 'EditPanel';
export default EditPanel;
