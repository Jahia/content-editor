import {registry} from '@jahia/ui-extender';
import {PickerDialog} from './PickerDialog';

export default function () {
    registry.add('externalPickerConfiguration', 'test', {
        requireModuleInstalledOnSite: 'default',
        pickerConfigs: ['file'],
        selectableTypes: ['rep:root'],
        keyUrlPath: 'zzzz',
        pickerInput: {
            emptyLabel: 'Nothing selected'
        },
        pickerDialog: {
            cmp: PickerDialog,
            label: 'Custom picker',
            description: 'Custom picker description'
        }
    });
}
