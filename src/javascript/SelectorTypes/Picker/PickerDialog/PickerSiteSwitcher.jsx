import React from 'react';
import {cePickerSite, cePickerClearOpenPaths} from '~/SelectorTypes/Picker/Picker2.redux';
import {SiteSwitcher} from '@jahia/jcontent';
import {batchActions} from 'redux-batched-actions';

const switcherSelector = state => ({
    siteKey: state.contenteditor.picker.site,
    currentLang: state.language
});

export const PickerSiteSwitcher = () => {
    return (
        <SiteSwitcher selector={switcherSelector}
                      onSelectAction={siteNode => {
                          return batchActions([cePickerClearOpenPaths(), cePickerSite(siteNode.name)]);
                      }}
        />
    );
};
