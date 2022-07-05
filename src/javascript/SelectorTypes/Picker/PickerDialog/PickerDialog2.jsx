import React, {Suspense} from 'react';
import PropTypes from 'prop-types';
import {Dialog, Slide} from '@material-ui/core';
import styles from './PickerDialog.scss';
import {LayoutModule} from '@jahia/moonstone';
import {cePickerPath, cePickerSite, cePickerMode} from '~/SelectorTypes/Picker/Picker2.redux';
import {Constants as AccordionItemConstants} from '~/SelectorTypes/Picker/Picker2.constants';
import {batchActions} from 'redux-batched-actions';

const Transition = props => {
    return <Slide direction="up" {...props}/>;
};

const ContentNavigation = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentNavigation})));

const SiteSwitcher = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.SiteSwitcher})));

const selector = state => ({
    mode: state.contenteditor.picker.mode,
    siteKey: state.contenteditor.picker.site,
    language: state.language
});

const switcherSelector = state => ({
    siteKey: state.contenteditor.picker.site,
    currentLang: state.language
});

export const PickerDialog = ({isOpen, onClose, pickerConfig}) => {
    return (
        <Dialog
            fullScreen
            classes={{root: styles.rootDialog}}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={onClose}
        >
            <Suspense fallback={<div>Loading picker ...</div>}>
                <LayoutModule navigation={
                    <ContentNavigation header={<div><SiteSwitcher selector={switcherSelector} onSelectAction={siteNode => cePickerSite(siteNode.name)}/></div>}
                                       accordionItemType={AccordionItemConstants.ACCORDION_ITEM_NAME}
                                       accordionItemTarget={pickerConfig.key}
                                       selector={selector}
                                       handleNavigationAction={(mode, path) => (batchActions([cePickerPath(path), cePickerMode(mode)]))}
                    />
                }
                              content={<h1>Add content list here</h1>}
                />
            </Suspense>
        </Dialog>
    );
};

PickerDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    pickerConfig: PropTypes.object.isRequired
};
