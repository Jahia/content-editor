
export const registerDamPicker = registry => {
    registry.add('pickerSelectorConfiguration','Picker',{
        module: 'default',
        selectableTypes: ['jnt:content', 'jnt:file', 'jnt:page', 'jmix:navMenuItem'],

    });
}
