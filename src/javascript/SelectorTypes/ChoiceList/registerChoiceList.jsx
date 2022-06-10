import {ChoiceList} from '~/SelectorTypes/ChoiceList/index';
import {registerChoiceListActions} from './actions/registerChoiceListActions';
import {registerChoiceListOnChange} from './registerChoiceListOnChange';

export const registerChoiceList = ceRegistry => {
    ceRegistry.add('selectorType', 'Choicelist', {
        cmp: ChoiceList,
        supportMultiple: true,
        initValue: field => {
            const defaultValueConstraints = field.valueConstraints.filter(v => v?.properties.find(p => p.name === 'defaultProperty' && p.value === 'true'));

            if (defaultValueConstraints.length > 0) {
                return field.multiple ? defaultValueConstraints.map(v => v.value.string) : defaultValueConstraints[0].value.string;
            }
        }
    });
    registerChoiceListActions(ceRegistry);
    registerChoiceListOnChange(ceRegistry);
};
