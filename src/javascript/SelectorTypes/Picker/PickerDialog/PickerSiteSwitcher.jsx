import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {cePickerMode, cePickerOpenPaths, cePickerPath, cePickerSite} from '~/SelectorTypes/Picker/Picker2.redux';
import {registry} from '@jahia/ui-extender';
import {getItemTarget} from '~/SelectorTypes/Picker/accordionItems/accordionItems';
import {getDetailedPathArray} from '~/SelectorTypes/Picker/Picker2.utils';
import {batchActions} from 'redux-batched-actions';
import {SiteSwitcher} from '@jahia/jcontent';
import {configPropType} from '~/SelectorTypes/Picker/configs/configPropType';

const switcherSelector = state => ({
    siteKey: state.contenteditor.picker.site,
    currentLang: state.language
});

export const PickerSiteSwitcher = ({pickerConfig}) => {
    const state = useSelector(state => ({
        mode: state.contenteditor.picker.mode,
        openPaths: state.contenteditor.picker.openPaths
    }), shallowEqual);

    return (
        <SiteSwitcher selector={switcherSelector}
                      onSelectAction={siteNode => {
                          const actions = [];
                          actions.push(cePickerSite(siteNode.name));
                          const accordionItems = registry.find({
                              type: 'accordionItem',
                              target: getItemTarget(pickerConfig.key)
                          })
                              .filter(accordionItem => !accordionItem.isEnabled || accordionItem.isEnabled(siteNode.name));
                          const selectedAccordion = accordionItems.find(item => item.key === state.mode) || accordionItems[0];
                          const newPath = selectedAccordion.defaultPath(siteNode.name);
                          actions.push(cePickerPath(newPath));
                          actions.push(cePickerMode(selectedAccordion.key));
                          actions.push(cePickerOpenPaths([...state.openPaths, ...getDetailedPathArray(newPath, siteNode.name)]));

                          return batchActions(actions);
                      }}
        />
    );
};

PickerSiteSwitcher.propTypes = {
    pickerConfig: configPropType.isRequired
};
