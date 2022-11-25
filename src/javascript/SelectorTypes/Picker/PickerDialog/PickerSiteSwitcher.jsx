import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {cePickerMode, cePickerOpenPaths, cePickerPath, cePickerSite} from '~/SelectorTypes/Picker/Picker.redux';
import {getDetailedPathArray} from '~/SelectorTypes/Picker/Picker.utils';
import {batchActions} from 'redux-batched-actions';
import {SiteSwitcher, jcontentUtils} from '@jahia/jcontent';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';
import PropTypes from 'prop-types';

const switcherSelector = state => ({
    siteKey: state.contenteditor.picker.site,
    currentLang: state.language
});

export const PickerSiteSwitcher = ({pickerConfig, accordionItemProps}) => {
    const state = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        openPaths: state.contenteditor.picker.openPaths
    }), shallowEqual);

    return (
        <SiteSwitcher selector={switcherSelector}
                      onSelectAction={siteNode => {
                          const actions = [];
                          actions.push(cePickerSite(siteNode.name));
                          const accordionItems = jcontentUtils.getAccordionItems(pickerConfig.key, accordionItemProps)
                              .filter(accordionItem => !accordionItem.isEnabled || accordionItem.isEnabled(siteNode.name));
                          const selectedAccordion = accordionItems.find(item => item.key === state.mode) || accordionItems[0];
                          const newPath = selectedAccordion.getRootPath(siteNode.name);
                          actions.push(cePickerPath(newPath));
                          actions.push(cePickerMode(selectedAccordion.key));
                          actions.push(cePickerOpenPaths([...state.openPaths, ...getDetailedPathArray(newPath, siteNode.name)]));

                          return batchActions(actions);
                      }}
        />
    );
};

PickerSiteSwitcher.propTypes = {
    pickerConfig: configPropType.isRequired,
    accordionItemProps: PropTypes.object
};
