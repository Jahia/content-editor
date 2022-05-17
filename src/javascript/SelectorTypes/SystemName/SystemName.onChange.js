import {Constants} from '~/ContentEditor.constants';
import {limitSystemNameIfNecessary, replaceSpecialCharacters} from './SystemName.utils';

const registerSystemNameOnChange = registry => {
    registry.add('selectorType.onChange', 'systemNameSync', {
        targets: ['Text'],
        onChange: (previousValue, currentValue, currentField, editorContext) => {
            if (currentField.propertyName === 'jcr:title' &&
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
                    const cleanedSystemName = replaceSpecialCharacters(currentValue);
                    editorContext.formik.setFieldValue(Constants.systemName.name, limitSystemNameIfNecessary(cleanedSystemName, systemNameField));
                    editorContext.formik.setFieldTouched(Constants.systemName.name, true, false);
                }
            }
        }
    });
};

export default registerSystemNameOnChange;
