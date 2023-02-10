import MultipleLeftRightSelector from './MultipleLeftRightSelector';

export const registerMultipleLeftRightSelector = ceRegistry => {
    ceRegistry.add('selectorType', 'MultipleLeftRightSelector', {
        dataType: ['String'],
        cmp: MultipleLeftRightSelector,
        labelKey: 'content-editor:label.contentEditor.selectorTypes.multipleLeftRightSelector.displayValue',
        properties: [
            {name: 'description', value: 'content-editor:label.contentEditor.selectorTypes.multipleLeftRightSelector.description'},
            {name: 'iconStart', value: 'MultipleListSelector'}
        ],
        supportMultiple: true,
        initValue: field => {
            const defaultValueConstraints = field.valueConstraints.filter(v => v?.properties?.find(p => p.name === 'defaultProperty' && p.value === 'true'));

            if (defaultValueConstraints.length > 0) {
                return field.multiple ? defaultValueConstraints.map(v => v.value.string) : defaultValueConstraints[0].value.string;
            }
        }
    });
};
