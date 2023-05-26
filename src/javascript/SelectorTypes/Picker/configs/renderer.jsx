import React from 'react';
import {AccordionItem} from '@jahia/moonstone';
import {cePickerClosePaths, cePickerOpenPaths, cePickerPath} from '~/SelectorTypes/Picker/Picker.redux';
import {ContentTree} from '@jahia/jcontent';

const selector = state => ({
    siteKey: state.contenteditor.picker.site,
    lang: state.contenteditor.ceLanguage,
    path: state.contenteditor.picker.path,
    openPaths: state.contenteditor.picker.openPaths
});

const actions = {
    setPathAction: path => cePickerPath(path),
    openPathAction: path => cePickerOpenPaths([path]),
    closePathAction: path => cePickerClosePaths([path])
};

export const renderer = {
    render: (v, item) => (
        <AccordionItem key={v.id} {...v}>
            <ContentTree refetcherType="cePickerRefetcher" item={item} selector={selector} {...actions} isReversed={false}/>
        </AccordionItem>
    ),
    getRootPath(site) {
        return this.rootPath.replace('{site}', site);
    }
};
