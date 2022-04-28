import React from 'react';
import PropTypes from 'prop-types';
import {useContentEditorContext} from '~/ContentEditor.context';
import classes from './EditPanel.scss';
import clsx from 'clsx';
import {DisplayAction, DisplayActions, registry} from '@jahia/ui-extender';
import {Constants} from '~/ContentEditor.constants';
import {WindowListeners} from './WindowListeners';
import {DialogActions, DialogTitle} from '@material-ui/core';
import {Button, Typography} from '@jahia/moonstone';
import {GoBack} from '~/actions/goBack.action';
import {getButtonRenderer} from '~/utils/getButtonRenderer';
import {EditPanelLanguageSwitcher} from '~/EditPanel/EditPanelLanguageSwitcher';

const ButtonRenderer = getButtonRenderer({
    defaultButtonProps: {size: 'big', style: {margin: '8px'}},
    noIcon: true
});

const EditPanelCompact = ({title}) => {
    const {siteInfo, nodeData, lang} = useContentEditorContext();

    const tabs = registry.find({target: 'editHeaderTabsActions'});
    const EditTabComponent = tabs.find(tab => tab.value === Constants.editPanel.editTab).displayableComponent;

    return (
        <>
            <WindowListeners/>

            <DialogTitle id="draggable-dialog-title">
                <div className="flexRow">
                    <Typography variant="heading">{title}</Typography>
                    <div className="flexFluid"/>
                    <DisplayAction
                        actionKey="content-editor/header/3dots"
                        render={({dataSelRole, buttonIcon, onClick, ...props}) => (
                            <Button
                                data-sel-role={dataSelRole}
                                icon={buttonIcon}
                                variant="ghost"
                                onClick={e => {
                                    e.stopPropagation();
                                    onClick(props, e);
                                }}
                            />
                        )}/>
                </div>
                <div className="flexRow">
                    <EditPanelLanguageSwitcher lang={lang} siteInfo={siteInfo}/>
                </div>
            </DialogTitle>
            <div className={clsx(classes.tab, 'flexCol')}>
                <EditTabComponent nodePath={nodeData.path} lang={lang}/>
            </div>
            <DialogActions>
                <GoBack
                    componentProps={{
                        'data-sel-role': 'backButton'
                    }}
                    buttonLabel="Cancel"
                    actionKey="backButton"
                    render={ButtonRenderer}
                />
                <DisplayActions
                    buttonProps={{
                        color: 'accent'
                    }}
                    target="content-editor/header/main-save-actions"
                    render={ButtonRenderer}
                />
            </DialogActions>
        </>
    );
};

EditPanelCompact.propTypes = {
    title: PropTypes.string.isRequired
};

EditPanelCompact.displayName = 'EditPanelCompact';
export default EditPanelCompact;
