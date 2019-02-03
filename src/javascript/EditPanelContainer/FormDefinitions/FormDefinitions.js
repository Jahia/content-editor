const QAAllFieldFormDefinition = {
    nodeType: 'qant:allFields',
    targets: [
        {
            name: 'content',
            fields: [
                {
                    name: 'sharedSmallText',
                    fieldType: 'Text',
                    i18n: false
                },
                {
                    name: 'sharedBigtext',
                    fieldType: 'RichText',
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
