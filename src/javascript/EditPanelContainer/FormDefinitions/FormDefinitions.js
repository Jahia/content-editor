const QAAllFieldFormDefinition = {
    nodeType: 'qant:allFields',
    targets: [
        {
            name: 'content',
            fields: [
                {
                    name: 'sharedSmallText',
                    selectorType: 'Text',
                    i18n: false
                },
                {
                    name: 'sharedBigtext',
                    selectorType: 'RichText',
                    i18n: false
                }
            ]
        }
    ]
};

const FormDefinitions = {
    'qant:allFields': QAAllFieldFormDefinition
};

export default FormDefinitions;
