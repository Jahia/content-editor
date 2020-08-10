import {Constants} from '~/ContentEditor.constants';

const registerSystemNameOnChange = registry => {
    registry.add('selectorType.onChange', 'systemNameSync', {
        targets: ['Text'],
        onChange: (previousValue, currentValue, currentField, editorContext) => {
            if (currentField.name === 'jcr:title' &&
                editorContext.mode === Constants.routes.baseCreateRoute &&
                !editorContext.name &&
                window.contextJsParameters.config.defaultSynchronizeNameWithTitle) {
                // Find system name field
                let systemNameField;
                for (const section of editorContext.sections) {
                    for (const fieldSet of section.fieldSets) {
                        for (const field of fieldSet.fields) {
                            if (field.name === Constants.systemName.name) {
                                systemNameField = field;
                                break;
                            }
                        }

                        if (systemNameField) {
                            break;
                        }
                    }

                    if (systemNameField) {
                        break;
                    }
                }

                if (systemNameField && !systemNameField.readOnly) {
                    editorContext.formik.setFieldValue(Constants.systemName.name, currentValue, true);
                    editorContext.formik.setFieldTouched(Constants.systemName.name, true);
                }
            }
        }
    });
};

export default registerSystemNameOnChange;
