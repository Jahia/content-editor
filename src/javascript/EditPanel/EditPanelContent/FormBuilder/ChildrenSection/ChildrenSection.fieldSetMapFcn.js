import {Constants} from '~/ContentEditor.constants';
import {FieldSet} from './ListSizeLimitFieldSet';

export default fieldSet => {
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
