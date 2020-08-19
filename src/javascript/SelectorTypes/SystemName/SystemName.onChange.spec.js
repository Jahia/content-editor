import {registry} from '@jahia/ui-extender';
import registerSystemNameOnChange from './SystemName.onChange';
import {Constants} from '~/ContentEditor.constants';

registerSystemNameOnChange(registry);
const systemNameOnChange = registry.get('selectorType.onChange', 'systemNameSync').onChange;

describe('System name onChange', () => {
    let editorContext;
    let currentField;

    beforeEach(() => {
        currentField = {
            name: 'jcr:title'
        };
        editorContext = {
            mode: Constants.routes.baseCreateRoute,
            sections: [{
                fieldSets: [{
                    fields: [{
                        name: Constants.systemName.name,
                        readOnly: false,
                        selectorOptions: []
                    }]
                }]
            }],
            formik: {
                setFieldValue: jest.fn(),
                setFieldTouched: jest.fn()
            }
        };
        global.contextJsParameters = {
            config: {
                defaultSynchronizeNameWithTitle: true
            }
        };
    });

    it('Should sync the systemName when updating the jcr:title', () => {
        systemNameOnChange(undefined, 'this is the jcr:title', currentField, editorContext);
        expect(editorContext.formik.setFieldValue).toHaveBeenCalledWith(Constants.systemName.name, 'this is the jcr:title', true);
        expect(editorContext.formik.setFieldTouched).toHaveBeenCalledWith(Constants.systemName.name, true);
    });

    it('should not sync the systemName in case of edition', () => {
        editorContext.mode = Constants.routes.baseEditRoute;
        systemNameOnChange(undefined, 'this is the jcr:title', currentField, editorContext);
        expect(editorContext.formik.setFieldValue).not.toHaveBeenCalled();
        expect(editorContext.formik.setFieldTouched).not.toHaveBeenCalled();
    });

    it('should not sync the systemName in case systemName is readOnly', () => {
        editorContext.sections[0].fieldSets[0].fields[0].readOnly = true;
        systemNameOnChange(undefined, 'this is the jcr:title', currentField, editorContext);
        expect(editorContext.formik.setFieldValue).not.toHaveBeenCalled();
        expect(editorContext.formik.setFieldTouched).not.toHaveBeenCalled();
    });

    it('should not sync the systemName in case of creation of named content', () => {
        editorContext.name = 'toto';
        systemNameOnChange(undefined, 'this is the jcr:title', currentField, editorContext);
        expect(editorContext.formik.setFieldValue).not.toHaveBeenCalled();
        expect(editorContext.formik.setFieldTouched).not.toHaveBeenCalled();
    });

    it('should not sync the systemName in case the jahia.prop defaultSynchronizeNameWithTitle is set to false', () => {
        global.contextJsParameters.config.defaultSynchronizeNameWithTitle = false;
        systemNameOnChange(undefined, 'this is the jcr:title', currentField, editorContext);
        expect(editorContext.formik.setFieldValue).not.toHaveBeenCalled();
        expect(editorContext.formik.setFieldTouched).not.toHaveBeenCalled();
    });

    it('should not sync the systemName in case the prop changed is not jcr:title', () => {
        currentField.name = 'jcr:toto';
        systemNameOnChange(undefined, 'this is the jcr:title', currentField, editorContext);
        expect(editorContext.formik.setFieldValue).not.toHaveBeenCalled();
        expect(editorContext.formik.setFieldTouched).not.toHaveBeenCalled();
    });
});
