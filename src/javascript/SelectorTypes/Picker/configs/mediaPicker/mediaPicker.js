import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {MediaPickerConfig} from '~/SelectorTypes/Picker/configs/mediaPicker/MediaPickerConfig';
import React from 'react';
import PropTypes from 'prop-types';
import {FilesQueryHandler} from '@jahia/jcontent';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {transformQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import {FilePickerCaption} from '~/SelectorTypes/Picker/configs/mediaPicker/FilePickerCaption';

// Todo: implement selector / action
// const fileModeSelectorProps = {
//     selector: () => ({
//         mode: null
//     }),
//     setModeAction: () => ({})
// };

export const registerMediaPickers = registry => {
    registry.add(Constants.pickerConfig, 'file', mergeDeep({}, ContentPickerConfig, {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle'
        },
        searchSelectorType: 'jnt:file',
        selectableTypesTable: ['jnt:file'],
        pickerCaptionComponent: FilePickerCaption
    }));

    registry.add(Constants.pickerConfig, 'image', mergeDeep({}, MediaPickerConfig, {
        searchSelectorType: 'jmix:image',
        selectableTypesTable: ['jmix:image'],
        pickerCaptionComponent: FilePickerCaption
    }));

    const mediaItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.MEDIA);
    if (mediaItem) {
        registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.MEDIA}`, {
            ...mediaItem,
            viewSelector: false, // Todo: implement thumbnail and enable selector : <FileModeSelector {...fileModeSelectorProps}/>,
            targets: ['default:70', 'image:70', 'file:70'],
            defaultSort: {orderBy: 'lastModified.value', order: 'DESC'},
            queryHandler: transformQueryHandler(FilesQueryHandler)
        }, renderer);
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for media');
    }
};
