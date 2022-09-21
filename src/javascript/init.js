import {registry} from '@jahia/ui-extender';
import {register} from './register';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {MoreVert} from '@jahia/moonstone';
import React from 'react';

export default function () {
    registry.add('callback', 'content-editor', {
        targets: ['jahiaApp-init:2'],
        callback: register
    });

    registry.add('callback', 'updateAccordionTargetsFromPickerConfigurations', {
        targets: ['jahiaApp-init:999'],
        callback: () => {
            const registeredPickerConfigurations = registry.find({type: Constants.pickerConfig});
            registeredPickerConfigurations.forEach(pickerConfig => {
                pickerConfig.accordions?.forEach(value => {
                    const accordionItem = registry.get('accordionItem', value);
                    accordionItem.targets.push({id: pickerConfig.key, priority: 50});
                });
            });
            // Update actions targets
            registry.add('action', 'contentPickerMenu', registry.get('action', 'menuAction'), {
                buttonIcon: <MoreVert/>,
                buttonLabel: 'jcontent:label.contentManager.contentPreview.moreOptions',
                menuTarget: 'contentPickerActions',
                menuItemProps: {
                    isShowIcons: true
                }
            });

            registry.get('action', 'rename')?.targets?.push({id: 'contentPickerActions', priority: 1});
            registry.get('action', 'replaceFile')?.targets?.push({id: 'contentPickerActions', priority: 2});
            registry.get('action', 'editImage')?.targets?.push({id: 'contentPickerActions', priority: 3});
            registry.get('action', 'openInNewTab')?.targets?.push({id: 'contentPickerActions', priority: 4});
        }
    });
}
