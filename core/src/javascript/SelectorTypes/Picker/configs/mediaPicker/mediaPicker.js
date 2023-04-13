import React from 'react';
import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {useMediaPickerInputData} from '~/SelectorTypes/Picker/configs/mediaPicker/useMediaPickerInputData';
import {FileModeSelector} from '@jahia/jcontent';
import {transformQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import {FilePickerCaption} from '~/SelectorTypes/Picker/configs/mediaPicker/FilePickerCaption';
import {cePickerSetFileViewMode} from '~/SelectorTypes/Picker/Picker.redux';
import {FileImage} from '@jahia/moonstone';
import {PickerFilesQueryHandler} from '~/SelectorTypes/Picker/configs/mediaPicker/PickerFilesQueryHandler';

function getMode(state, config) {
    if (state.contenteditor.picker.fileView.mode === '') {
        return config?.pickerDialog?.view === 'Thumbnail' ? Constants.fileView.mode.THUMBNAILS : Constants.fileView.mode.LIST;
    }

    return state.contenteditor.picker.fileView.mode;
}

const viewModeSelectorProps = config => ({
    selector: state => ({
        mode: getMode(state, config)
    }),
    setModeAction: mode => cePickerSetFileViewMode(mode)
});

export const registerMediaPickers = registry => {
    registry.add(Constants.pickerConfig, 'file', {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle'
        },
        selectionTable: {
            getFragments: PickerFilesQueryHandler.getFragments,
            columns: ['publicationStatus', 'name', 'fileSize', 'relPath']
        },
        searchContentType: 'jnt:file',
        selectableTypesTable: ['jnt:file'],
        pickerCaptionComponent: FilePickerCaption
    });

    registry.add(Constants.pickerConfig, 'image', {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalImageTitle',
            emptyIcon: <FileImage/>,
            usePickerInputData: useMediaPickerInputData
        },
        pickerDialog: {
            view: 'Thumbnail',
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalImageTitle',
            displayTree: true,
            displaySiteSwitcher: true,
            displaySearch: true
        },
        selectionTable: {
            getFragments: PickerFilesQueryHandler.getFragments,
            columns: ['publicationStatus', 'name', 'fileSize', 'relPath']
        },
        searchContentType: 'jmix:image',
        selectableTypesTable: ['jmix:image'],
        pickerCaptionComponent: FilePickerCaption
    });

    registry.add(Constants.pickerConfig, 'pdf', {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalPDFTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalPDFTitle'
        },
        selectionTable: {
            getFragments: PickerFilesQueryHandler.getFragments,
            columns: ['publicationStatus', 'name', 'fileSize', 'relPath']
        },
        searchContentType: 'jnt:file',
        selectableTypesTable: ['jnt:file'],
        accordionItem: {
            'picker-media': {
                tableConfig: {
                    tableDisplayFilter: [
                        {
                            evaluation: 'CONTAINS',
                            fieldName: 'content.mimeType.value',
                            value: 'pdf'
                        },
                        {evaluation: 'EQUAL', fieldName: 'isFile', value: 'false'}
                    ]
                }
            },
            'picker-search': {
                tableConfig: {
                    tableDisplayFilter: [
                        {
                            evaluation: 'CONTAINS',
                            fieldName: 'content.mimeType.value',
                            value: 'pdf'
                        }
                    ]
                }
            }
        },
        pickerCaptionComponent: FilePickerCaption
    });

    registry.add(Constants.pickerConfig, 'video', {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalVideoTitle'
        },
        pickerDialog: {
            view: 'Thumbnail',
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalVideoTitle'
        },
        selectionTable: {
            getFragments: PickerFilesQueryHandler.getFragments,
            columns: ['publicationStatus', 'name', 'fileSize', 'relPath']
        },
        searchContentType: 'jnt:file',
        selectableTypesTable: ['jnt:file'],
        accordionItem: {
            'picker-media': {
                tableConfig: {
                    tableDisplayFilter: [
                        {
                            evaluation: 'CONTAINS',
                            fieldName: 'content.mimeType.value',
                            value: 'video'
                        },
                        {evaluation: 'EQUAL', fieldName: 'isFile', value: 'false'}
                    ]
                }
            },
            'picker-search': {
                tableConfig: {
                    tableDisplayFilter: [
                        {
                            evaluation: 'CONTAINS',
                            fieldName: 'content.mimeType.value',
                            value: 'video'
                        }
                    ]
                }
            }
        },
        pickerCaptionComponent: FilePickerCaption
    });

    const mediaItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.MEDIA);
    if (mediaItem) {
        registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.MEDIA}`, {
            ...mediaItem,
            targets: ['default:70', 'image:70', 'file:70', 'pdf:70', 'video:70'],
            tableConfig: {
                ...mediaItem.tableConfig,
                defaultSort: {orderBy: 'lastModified.value', order: 'DESC'},
                queryHandler: transformQueryHandler(PickerFilesQueryHandler),
                openableTypes: ['jnt:folder'],
                viewSelector: ({pickerConfig}) => <FileModeSelector {...viewModeSelectorProps(pickerConfig)}/>,
                contextualMenu: 'contentPickerMenu',
                uploadFilter: (file, mode, pickerConfig) => pickerConfig.key !== 'image' || file.type.startsWith('image/'),
                columns: ['publicationStatus', 'name', 'lastModified']
            },
            treeConfig: {
                ...mediaItem.treeConfig,
                dnd: {}
            }
        }, renderer);
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for media');
    }
};
