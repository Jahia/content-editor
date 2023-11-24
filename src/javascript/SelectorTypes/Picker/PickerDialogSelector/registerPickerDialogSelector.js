import svgJahiaLogo from './asset/jahiaLogo.svg';
import {PickerDialog} from '../PickerDialog';

export const registerPickerDialogSelector = registry => {
    // Add config for the jahia picker
    registry.add('pickerDialogSelectorConfiguration', 'Picker', {
        types: ['jmix:image', 'jnt:file', 'jnt:content', 'jnt:page'],
        label: 'content-editor:label.damSelector.selectorConfig.label',
        description: 'content-editor:label.damSelector.selectorConfig.description',
        module: 'default',
        icon: svgJahiaLogo,
        pickerDialog: PickerDialog
    });
};
