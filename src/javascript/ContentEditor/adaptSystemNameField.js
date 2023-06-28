import {Constants} from '~/ContentEditor.constants';
import {decodeSystemName} from '~/utils';

const isContentOrFileNode = formData => {
    const pattern = '^/sites/[^/]*/(contents|files)$';
    const regex = RegExp(pattern);
    return formData.technicalInfo.filter(info => {
        return regex.test(info.value);
    }).length !== 0;
};

// TODO completely get rid of this adapter
export const adaptSystemNameField = (rawData, formData, t, primaryNodeType, isCreate, readOnlyByMixin) => {
    const systemNameField = formData.sections
        .flatMap(section => section.fieldSets)
        .flatMap(fieldSet => fieldSet.fields)
        .find(field => field.name.endsWith('_' + Constants.systemName.propertyName));

    if (systemNameField) {
        systemNameField.name = Constants.systemName.name;

        // Add i18ns label to field / should be in json field definition
        systemNameField.displayName = t('content-editor:label.contentEditor.section.fieldSet.system.fields.systemName');

        // Add description to the field / should be in json field definition, with specific overrides per "read only mixin"
        // Parameterized resource bundles not supported yet
        systemNameField.description = readOnlyByMixin ?
            t('content-editor:label.contentEditor.section.fieldSet.system.fields.systemNameDescriptionReadOnly') :
            t('content-editor:label.contentEditor.section.fieldSet.system.fields.systemNameDescription', {maxNameSize: window.contextJsParameters.config.maxNameSize});

        // Add max name size validation / should be in json field definition
        systemNameField.selectorOptions = [
            {
                name: 'maxLength',
                value: window.contextJsParameters.config.maxNameSize
            }
        ];

        // System name should be readonly for this specific nodetypes / should be in json overrides
        if (readOnlyByMixin ||
            Constants.systemName.READONLY_FOR_NODE_TYPES.includes(primaryNodeType.name) ||
            isContentOrFileNode(formData) ||
            (!isCreate && !formData.nodeData.hasWritePermission) ||
            formData.nodeData.lockedAndCannotBeEdited) {
            systemNameField.readOnly = true;
        }
    }

    // Set initial value for system name / should be move to getInitialValues
    if (isCreate) {
        formData.initialValues[Constants.systemName.name] = rawData.jcr.result.newName;
    } else {
        formData.initialValues[Constants.systemName.name] = decodeSystemName(rawData.jcr.result.name);
    }
};

