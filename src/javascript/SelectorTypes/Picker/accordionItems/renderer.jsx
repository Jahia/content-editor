import React from 'react';
import {AccordionItem} from '@jahia/moonstone';
import {cePickerClosePaths, cePickerOpenPaths, cePickerPath} from '~/SelectorTypes/Picker/Picker2.redux';

const ContentTree = React.lazy(() => import('@jahia/jcontent').then(module => ({default: module.ContentTree})));

const selector = state => ({
    siteKey: state.contenteditor.picker.site,
    lang: state.language,
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
        <AccordionItem key={v.id} id={v.id} label={v.label} icon={v.icon}>
            <ContentTree refetcherType="cePickerRefetcher" item={item} selector={selector} {...actions}/>
        </AccordionItem>
    )
};
