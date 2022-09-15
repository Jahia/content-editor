import React from 'react';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {MediaPickerConfig} from '~/SelectorTypes/Picker/configs/mediaPicker/MediaPickerConfig';
import {FilesQueryHandler, FileModeSelector} from '@jahia/jcontent';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {transformQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import {FilePickerCaption} from '~/SelectorTypes/Picker/configs/mediaPicker/FilePickerCaption';
import {cePickerSetFileViewMode} from '~/SelectorTypes/Picker/Picker2.redux';
import {registry} from '@jahia/ui-extender';

function getMode(state) {
    if (state.contenteditor.picker.fileView.mode === '') {
        const config = registry.get(Constants.pickerConfig, state.contenteditor.picker.pickerKey);
        if (config === undefined) {
            return Constants.fileView.mode.LIST;
        }

        return config.pickerDialog.view === 'Thumbnail' ? Constants.fileView.mode.THUMBNAILS : Constants.fileView.mode.LIST;
    }

    return state.contenteditor.picker.fileView.mode;
}

const viewModeSelectorProps = {
    selector: state => ({
        mode: getMode(state)
    }),
    setModeAction: mode => cePickerSetFileViewMode(mode)
};

export const registerMediaPickers = registry => {
    registry.add(Constants.pickerConfig, 'file', mergeDeep({}, ContentPickerConfig, {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle'
        },
        searchContentType: 'jnt:file',
        selectableTypesTable: ['jnt:file'],
        pickerCaptionComponent: FilePickerCaption
    }));

    registry.add(Constants.pickerConfig, 'image', mergeDeep({}, MediaPickerConfig, {
        searchContentType: 'jmix:image',
        selectableTypesTable: ['jmix:image'],
        pickerCaptionComponent: FilePickerCaption
    }));

    const mediaItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.MEDIA);
    if (mediaItem) {
        registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.MEDIA}`, {
            ...mediaItem,
            targets: ['default:70', 'image:70', 'file:70'],
            tableConfig: {
                ...mediaItem.tableConfig,
                defaultSort: {orderBy: 'lastModified.value', order: 'DESC'},
                queryHandler: transformQueryHandler(FilesQueryHandler),
                openableTypes: ['jnt:folder'],
                viewSelector: <FileModeSelector {...viewModeSelectorProps}/>,
                contextualMenu: 'contentPickerMenu',
                uploadFilter: (file, mode, pickerKey) => pickerKey !== 'image' || file.type.startsWith('image/')
            }
        }, renderer);
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for media');
    }
};
