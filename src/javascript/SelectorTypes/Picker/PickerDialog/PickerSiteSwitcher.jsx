import React from 'react';
import {cePickerSite} from '~/SelectorTypes/Picker/Picker2.redux';
import {SiteSwitcher} from '@jahia/jcontent';

const switcherSelector = state => ({
    siteKey: state.contenteditor.picker.site,
    currentLang: state.language
});

export const PickerSiteSwitcher = () => {
    return (
        <SiteSwitcher selector={switcherSelector}
                      onSelectAction={siteNode => {
                          return cePickerSite(siteNode.name);
                      }}
        />
    );
};
