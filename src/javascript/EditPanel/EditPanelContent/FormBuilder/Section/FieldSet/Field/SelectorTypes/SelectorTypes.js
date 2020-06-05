import Tag from './Tag';
import Text from './Text';
import TextArea from './TextArea';
import {RichText, RichTextMarkdown} from './RichText';
import ChoiceList from './ChoiceList';
import choiceListActions from './ChoiceList/ChoiceList.actions';
import DateTimePicker from './DateTimePicker';
import pickerConfigs from './Picker';
import Checkbox from './Checkbox';
import Category from './Category';

let SelectorTypes = {};

const adaptDateProperty = (field, property) => {
    return field.multiple ? property.notZonedDateValues : property.notZonedDateValue;
};

// Workaround for unit tests to avoid: "Couldn't call getPickerSelectorTypes() of undefined."
if (pickerConfigs) {
    SelectorTypes = {
        Category: {cmp: Category, key: 'Category', supportMultiple: true},
        Tag: {cmp: Tag, key: 'Tag', supportMultiple: true},
        Text: {cmp: Text, key: 'Text', supportMultiple: false},
        TextArea: {cmp: TextArea, key: 'TextArea', supportMultiple: false},
        RichText: {
            default: {cmp: RichText, key: 'RichText', supportMultiple: false},
            markdown: {cmp: RichTextMarkdown, key: 'RichText', supportMultiple: false}
        },
        Choicelist: {cmp: ChoiceList, key: 'Choicelist', actions: choiceListActions, supportMultiple: true},
        DateTimePicker: {
            cmp: DateTimePicker,
            key: 'DateTimePicker',
            supportMultiple: false,
            adaptValue: adaptDateProperty
        },
        DatePicker: {
            cmp: DateTimePicker,
            key: 'DatePicker',
            supportMultiple: false,
            adaptValue: adaptDateProperty},
        Checkbox: {
            cmp: Checkbox,
            key: 'Checkbox',
            initValue: field => {
                return field.mandatory && !field.multiple ? false : undefined;
            },
            adaptValue: (field, property) => {
                return field.multiple ? property.values.map(value => value === 'true') : property.value === 'true';
            },
            supportMultiple: false
        },
        ...pickerConfigs.getPickerSelectorTypes()
    };
}

export {SelectorTypes};

export const SelectorTypeResolvers = {
    Picker: options => pickerConfigs.getPickerSelectorType(options)
};
