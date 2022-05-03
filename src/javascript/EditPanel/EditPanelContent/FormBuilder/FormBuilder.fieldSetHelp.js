import {Constants} from '~/ContentEditor.constants';
import {FieldSet} from './ChildrenSection/ListSizeLimitFieldSet';

const orderingSectionFieldSetMap = fieldSet => {
    if (fieldSet.name === 'jmix:listSizeLimit') {
        fieldSet.comp = FieldSet;
        fieldSet.description = 'content-editor:label.contentEditor.section.listSizeLimit.description';
        fieldSet.nodeCheck = {
            options: {
                requiredPermission: [Constants.permissions.setContentLimitsOnAreas]
            }
        };
        fieldSet.visibilityFunction = (fs, resp) => resp.node && resp.node[Constants.permissions.setContentLimitsOnAreas];
    }

    return fieldSet;
};

const filterRegularFieldSets = fieldSets => {
    const hideFieldSet = fieldSet => {
        if (!fieldSet) {
            return false;
        }

        if (!fieldSet.displayed) {
            return true;
        }

        // We must hide fieldSet in the section when the fieldSet is not dynamic and
        // the fieldSet doesn't contain any fields (empty).
        return !fieldSet.dynamic && fieldSet.fields.length === 0;
    };

    return fieldSets.filter(fs => !hideFieldSet(fs));
};

export {
    orderingSectionFieldSetMap,
    filterRegularFieldSets
};
