import Tag from './Tag';
import Text from './Text';
import TextArea from './TextArea';
import RichText from './RichText';
import ChoiceList from './ChoiceList';
import registerChoiceListActions from './ChoiceList/ChoiceList.actions';
import DateTimePicker from './DateTimePicker';
import pickerConfigs from './Picker';
import Checkbox from './Checkbox';
import Category from './Category';
import {registerPickerActions} from './Picker/actions';

const adaptDateProperty = (field, property) => {
    return field.multiple ? property.notZonedDateValues : property.notZonedDateValue;
};

export const registerSelectorTypes = registry => {
    registry.add('selectorType', 'Category', {cmp: Category, supportMultiple: true});
    registry.add('selectorType', 'Tag', {cmp: Tag, supportMultiple: true});
    registry.add('selectorType', 'Text', {cmp: Text, supportMultiple: false});
    registry.add('selectorType', 'TextArea', {cmp: TextArea, supportMultiple: false});
    registry.add('selectorType', 'RichText', {cmp: RichText, supportMultiple: false});
    registry.add('selectorType', 'DateTimePicker', {cmp: DateTimePicker, supportMultiple: false, adaptValue: adaptDateProperty});
    registry.add('selectorType', 'DatePicker', {cmp: DateTimePicker, supportMultiple: false, adaptValue: adaptDateProperty});

    registry.add('selectorType', 'Checkbox', {
        cmp: Checkbox,
        initValue: field => {
            return field.mandatory && !field.multiple ? false : undefined;
        },
        adaptValue: (field, property) => {
            return field.multiple ? property.values.map(value => value === 'true') : property.value === 'true';
        },
        supportMultiple: false
    });

    registry.add('selectorType', 'Picker', {resolver: options => pickerConfigs.getPickerSelectorType(options)});
    registerPickerActions(registry);

    registry.add('selectorType', 'Choicelist', {cmp: ChoiceList, supportMultiple: true});
    registerChoiceListActions(registry);
};
