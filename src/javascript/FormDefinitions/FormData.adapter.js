import {resolveSelectorType} from '~/SelectorTypes';
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
            }
        }
    }

    // Set initial value for system name
    if (isCreate) {
        formData.initialValues[Constants.systemName.name] = rawData.jcr.result.newName;
    } else {
        formData.initialValues[Constants.systemName.name] = decodeSystemName(rawData.jcr.result.name);
    }
};

export const adaptSections = sections => {
    const cloneSections = JSON.parse(JSON.stringify(sections));

    return cloneSections
        .reduce((result, section) => {
            if (section.name === 'metadata') {
                section.fieldSets = section.fieldSets.reduce((fieldSetsField, fieldSet) => {
                    if (fieldSet.fields.find(f => f.readOnly)) {
                        return [...fieldSetsField];
                    }

                    return [...fieldSetsField, fieldSet];
                }, []);
            }

            section.fieldSets = section.fieldSets.map(fieldSet => {
                return {...fieldSet, fields: fieldSet.fields.map(field => {
                    return {
                        ...field,
                        nodeType: fieldSet.name, // Store fieldSet original inside the field, useful for testing the nodeType declaring this prop
                        name: fieldSet.name + '_' + field.name, // Generate input name
                        propertyName: field.name // JCR property name, used for saving
                    };
                })};
            });

            return [...result, section];
        }, [])
        .filter(section => (section.name === 'listOrdering' || (section.fieldSets && section.fieldSets.length > 0)));
};

export const getFieldValuesFromDefaultValues = field => {
    const selectorType = resolveSelectorType(field);
    const formFields = {};

    if (field.defaultValues && field.defaultValues.length > 0) {
        const mappedValues = field.defaultValues.map(defaultValue => {
            return defaultValue.string;
        });

        if (selectorType.adaptValue) {
            formFields[field.name] = selectorType.adaptValue(field, {
                value: mappedValues[0],
                notZonedDateValue: mappedValues[0],
                values: mappedValues,
                notZonedDateValues: mappedValues
            });
        } else {
            formFields[field.name] = field.multiple ? mappedValues : mappedValues[0];
        }
    } else if (selectorType && selectorType.initValue) {
        formFields[field.name] = selectorType.initValue(field);
    }

    return formFields;
};
