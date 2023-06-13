import {Constants} from '~/ContentEditor.constants';
import {decodeSystemName} from '~/utils';

export const adaptSystemNameField = (rawData, formData, t, isCreate, readOnlyByMixin) => {
    let ntBaseFieldSet;
    let systemNameField;
    formData.sections.every(section => {
        return section.fieldSets.every(fs => {
            return fs.fields.every(f => {
                if (f.name === Constants.systemName.name) {
                    ntBaseFieldSet = fs;
                    systemNameField = f;
                    return false;
                }

                return true;
            });
        });
    });
    const contentSection = formData.sections.find(section => section.name === 'content');

    if (contentSection) {
        contentSection.displayName = t('content-editor:label.contentEditor.section.fieldSet.content.displayName');
    }

    if (ntBaseFieldSet && ntBaseFieldSet.name === 'nt:base') {
        // Add i18ns label to System fieldset
        ntBaseFieldSet.displayName = t('content-editor:label.contentEditor.section.fieldSet.system.displayName');
    }

    if (systemNameField) {
        // Add i18ns label to field
        systemNameField.displayName = t('content-editor:label.contentEditor.section.fieldSet.system.fields.systemName');

        // Add description to the field
        systemNameField.description = readOnlyByMixin ?
            t('content-editor:label.contentEditor.section.fieldSet.system.fields.systemNameDescriptionReadOnly') :
            t('content-editor:label.contentEditor.section.fieldSet.system.fields.systemNameDescription', {maxNameSize: window.contextJsParameters.config.maxNameSize});
    }

    // Set initial value for system name
    if (isCreate) {
        formData.initialValues[Constants.systemName.name] = rawData.jcr.result.newName;
    } else {
        formData.initialValues[Constants.systemName.name] = decodeSystemName(rawData.jcr.result.name);
    }
};

