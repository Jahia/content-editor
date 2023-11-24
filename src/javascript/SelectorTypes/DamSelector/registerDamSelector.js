import {DamSelector} from './DamSelector';
import svgJahiaLogo from './asset/jahiaLogo.svg';
import {PickerDialog} from '../Picker';

export const registerDamSelector = registry => {
    registry.add('selectorType', 'DamSelector', {cmp: DamSelector, supportMultiple: false});
    // Console.debug('%c DamSelector Editor Extensions  is activated', 'color: #3c8cba');

    // Add config for the jahia picker
    registry.add('damSelectorConfiguration', 'Picker', {
        types: ['jmix:image', 'jnt:file'],
        label: 'content-editor:label.damSelector.selectorConfig.label',
        description: 'content-editor:label.damSelector.selectorConfig.description',
        module: 'default',
        icon: svgJahiaLogo,
        pickerDialog: PickerDialog
    });
};
