import {ChoiceList} from './ChoiceList';
import {registerChoiceListActions} from './actions/registerChoiceListActions';
import {registerChoiceListOnChange} from './registerChoiceListOnChange';

export const registerChoiceList = ceRegistry => {
    ceRegistry.add('selectorType', 'Choicelist', {
        dataType: ['String'],
        cmp: ChoiceList,
        supportMultiple: true,
        labelKey: 'content-editor:label.contentEditor.selectorTypes.dropdown.displayValue',
        properties: [
            {name: 'description', value: 'content-editor:label.contentEditor.selectorTypes.dropdown.description'},
            {name: 'iconStart', value: 'ListSelection'}
        ],
        initValue: field => {
            const defaultValueConstraints = field.valueConstraints.filter(v => v?.properties?.find(p => p.name === 'defaultProperty' && p.value === 'true'));

            if (defaultValueConstraints.length > 0) {
                return field.multiple ? defaultValueConstraints.map(v => v.value.string) : defaultValueConstraints[0].value.string;
            }
        }
    });
    registerChoiceListActions(ceRegistry);
    registerChoiceListOnChange(ceRegistry);
};
