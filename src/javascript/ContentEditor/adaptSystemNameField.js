import {Constants} from '~/ContentEditor.constants';
import {decodeSystemName} from '~/utils';

const isContentOrFileNode = formData => {
    const pattern = '^/sites/[^/]*/(contents|files)$';
    const regex = RegExp(pattern);
    return formData.technicalInfo.filter(info => {
        return regex.test(info.value);
    }).length !== 0;
};

/**
 * Check if system name field should be moved under jcr:title field and perform the move
 * @param sections the form sections
 * @param systemNameField the system name field
 * @returns {boolean} true in case the field have been moved, false otherwise
 */
const checkMoveSystemNameToUnderJcrTitleField = (sections, systemNameField) => {
    for (const section of sections) {
        for (const fieldSet of section.fieldSets) {
            const jcrTitleIndex = fieldSet.fields.findIndex(field => field.propertyName === 'jcr:title');
            if (jcrTitleIndex > -1) {
                fieldSet.fields.splice(jcrTitleIndex + 1, 0, systemNameField);
                return true;
            }
        }
    }

    return false;
};

/**
 * Check if system name field should be moved to top section, top fieldSet of the form to be the first field displayed
 * Only for specific node types: page, folder, categories, etc..
 * @param primaryNodeType the primary node type
 * @param sections the form sections
 * @param systemNameField the system name field
 * @returns {boolean} true in case the field have been moved, false otherwise
 */
const moveSystemNameToTheTopOfTheForm = (primaryNodeType, sections, systemNameField, t) => {
    let contentSection = sections.find(section => section.name === 'content');
    if (!contentSection) {
        // Section doesnt exist, create it
        contentSection = {
            name: 'content',
            displayName: t('content-editor:label.contentEditor.section.fieldSet.content.displayName'),
            fieldSets: []
        };
        sections.unshift(contentSection);
    }

    let toBeMovedToFieldSet = contentSection.fieldSets.find(fieldSet => fieldSet.name === primaryNodeType.name);
    if (!toBeMovedToFieldSet) {
        // FieldSet doesnt exist, create it
        toBeMovedToFieldSet = {
            name: primaryNodeType.name,
            displayName: primaryNodeType.displayName,
            description: '',
            dynamic: false,
            activated: true,
            displayed: true,
            fields: []
        };
        contentSection.fieldSets.unshift(toBeMovedToFieldSet);
    }

    // Move system name field on top of this fieldset
    toBeMovedToFieldSet.fields.unshift(systemNameField);
};

const moveToOptionsSection = (sections, ntBaseFieldSet) => {
    sections.find(section => section.name === 'options')?.fieldSets?.unshift(ntBaseFieldSet);
};

export const adaptSystemNameField = (rawData, formData, lang, t, primaryNodeType, isCreate, canBeMovedToTop, readOnlyByMixin) => {
    let ntBaseFieldSet;
    let systemNameField;
    let sectionContainingSystemName;
    formData.sections.every(section => {
        ntBaseFieldSet = section.fieldSets.find(fieldSet => fieldSet.name === 'nt:base');
        if (ntBaseFieldSet) {
            systemNameField = ntBaseFieldSet.fields.find(field => field.name === Constants.systemName.name);
            sectionContainingSystemName = systemNameField && section;
            return false;
        }

        return true;
    });
    if (ntBaseFieldSet) {
        // Add i18ns label to System fieldset
        ntBaseFieldSet.displayName = t('content-editor:label.contentEditor.section.fieldSet.system.displayName');
        if (systemNameField) {
            // Add i18ns label to field
            systemNameField.displayName = t('content-editor:label.contentEditor.section.fieldSet.system.fields.systemName');

            // Add description to the field
            systemNameField.description = readOnlyByMixin ?
                t('content-editor:label.contentEditor.section.fieldSet.system.fields.systemNameDescriptionReadOnly') :
                t('content-editor:label.contentEditor.section.fieldSet.system.fields.systemNameDescription', {maxNameSize: window.contextJsParameters.config.maxNameSize});

            // Add max name size validation
            systemNameField.selectorOptions = [
                {
                    name: 'maxLength',
                    value: window.contextJsParameters.config.maxNameSize
                }
            ];

            // System name should be readonly for this specific nodetypes
            if (readOnlyByMixin ||
                Constants.systemName.READONLY_FOR_NODE_TYPES.includes(primaryNodeType.name) ||
                isContentOrFileNode(formData) ||
                (!isCreate && !formData.nodeData.hasWritePermission) ||
                formData.nodeData.lockedAndCannotBeEdited) {
                systemNameField.readOnly = true;
            }

            // Move to mix:title fieldSet if fieldSet exist
            let moved = checkMoveSystemNameToUnderJcrTitleField(formData.sections, systemNameField);

            // Move the systemName field to the top first section, fieldset, for specifics nodetypes
            if (!moved && canBeMovedToTop) {
                moveSystemNameToTheTopOfTheForm(primaryNodeType, formData.sections, systemNameField, t);
                moved = true;
            }

            if (moved) {
                // Remove system fieldSet, not used anymore
                sectionContainingSystemName.fieldSets = sectionContainingSystemName.fieldSets.filter(fieldSet => fieldSet.name !== 'nt:base');
            } else {
                moveToOptionsSection(formData.sections, ntBaseFieldSet);
            }

            formData.sections = formData.sections.filter(section => section.name !== 'systemSection');
        }
    }

    // Set initial value for system name
    if (isCreate) {
        formData.initialValues[Constants.systemName.name] = rawData.jcr.result.newName;
    } else {
        formData.initialValues[Constants.systemName.name] = decodeSystemName(rawData.jcr.result.name);
    }
};
