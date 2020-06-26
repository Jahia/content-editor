import Tag from './Tag';
import Text from './Text';
import TextArea from './TextArea';
import RichText from './RichText';
import ChoiceList from './ChoiceList';
import registerChoiceListActions from './ChoiceList/ChoiceList.actions';
import registerChoiceListOnChange from './ChoiceList/ChoiceList.onChange';
import DateTimePicker from './DateTimePicker';
import pickerConfigs from './Picker';
import Checkbox from './Checkbox';
import Category from './Category';
import {registerPickerActions} from './Picker/actions';
import {registry} from '@jahia/ui-extender';

const adaptDateProperty = (field, property) => {
    return field.multiple ? property.notZonedDateValues : property.notZonedDateValue;
};

export const registerSelectorTypes = ceRegistry => {
    ceRegistry.add('selectorType', 'Category', {cmp: Category, supportMultiple: true});
    ceRegistry.add('selectorType', 'Tag', {cmp: Tag, supportMultiple: true});
    ceRegistry.add('selectorType', 'Text', {
        cmp: Text,
        supportMultiple: false,
        adaptValue: (field, property) => {
            if (field.selectorOptions?.find(option => option.name === 'password')) {
                return property.encryptedValue;
            }
        }
    });
    ceRegistry.add('selectorType', 'TextArea', {cmp: TextArea, supportMultiple: false});
    ceRegistry.add('selectorType', 'RichText', {cmp: RichText, supportMultiple: false});
    ceRegistry.add('selectorType', 'DateTimePicker', {cmp: DateTimePicker, supportMultiple: false, adaptValue: adaptDateProperty});
    ceRegistry.add('selectorType', 'DatePicker', {cmp: DateTimePicker, supportMultiple: false, adaptValue: adaptDateProperty});

    ceRegistry.add('selectorType', 'Checkbox', {
        cmp: Checkbox,
        initValue: field => {
            return field.mandatory && !field.multiple ? false : undefined;
        },
        adaptValue: (field, property) => {
            return field.multiple ? property.values.map(value => value === 'true') : property.value === 'true';
        },
        supportMultiple: false
    });

    ceRegistry.add('selectorType', 'Picker', {resolver: options => pickerConfigs.getPickerSelectorType(options)});
    registerPickerActions(ceRegistry);

    ceRegistry.add('selectorType', 'Choicelist', {cmp: ChoiceList, supportMultiple: true});
    registerChoiceListActions(ceRegistry);
    registerChoiceListOnChange(ceRegistry);
};

export const resolveSelectorType = ({selectorType, selectorOptions}) => {
    let selector = registry.get('selectorType', selectorType);
    if (selector) {
        if (selector.resolver) {
            return selector.resolver(selectorOptions);
        }

        selector.key = selectorType;
        return selector;
    }
};
