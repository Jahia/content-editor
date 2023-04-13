import React from 'react';
import {shallow} from '@jahia/test-framework';

import {SystemName} from './SystemName';
import {Constants} from '~/ContentEditor.constants';
import {useFormikContext} from 'formik';

jest.mock('formik');

describe('SystemName component', () => {
    let props;
    let formik;
    beforeEach(() => {
        props = {
            onChange: jest.fn(),
            id: Constants.systemName.name,
            editorContext: {
                uilang: 'en',
                mode: Constants.routes.baseEditRoute
            },
            field: {
                name: Constants.systemName.name,
                displayName: Constants.systemName.name,
                readOnly: false,
                selectorType: 'SystemName',
                requiredType: 'STRING',
                selectorOptions: []
            },
            classes: {}
        };
        formik = {
            values: {}
        };
        useFormikContext.mockReturnValue(formik);
    });

    it('should be readOnly when formDefinition say so', () => {
        testReadOnly(true);
        testReadOnly(false);
    });

    it('should be readOnly when we are in creating a named content', () => {
        props.editorContext.mode = Constants.routes.baseCreateRoute;
        props.editorContext.name = 'namedContent';
        const cmp = shallow(<SystemName {...props}/>).find('Text');
        expect(cmp.props().field.readOnly).toBe(true);
    });

    it('should not display sync button if no jcr:title prop', () => {
        const cmp = shallow(<SystemName {...props}/>).find('Button');
        expect(cmp.length).toBe(0);
    });

    it('should not display sync button if create mode', () => {
        props.editorContext.mode = Constants.routes.baseCreateRoute;
        const cmp = shallow(<SystemName {...props}/>).find('Button');
        expect(cmp.length).toBe(0);
    });

    it('should display sync button if no jcr:title prop', () => {
        formik.values['toto_jcr:title'] = 'toto';
        const cmp = shallow(<SystemName {...props}/>).find('Button');
        expect(cmp.props().isDisabled).toBe(false);
    });

    it('should disable sync button if readOnly', () => {
        formik.values['toto_jcr:title'] = 'toto';
        props.field.readOnly = true;
        const cmp = shallow(<SystemName {...props}/>).find('Button');
        expect(cmp.props().isDisabled).toBe(true);
    });

    it('should disable sync button if jcr:title is the same as system name', () => {
        props.value = 'toto';
        formik.values['toto_jcr:title'] = 'toto';
        const cmp = shallow(<SystemName {...props}/>).find('Button');
        expect(cmp.props().isDisabled).toBe(true);
    });

    it('should sync system name when clicking on sync button', () => {
        formik.values['toto_jcr:title'] = 'toto';
        const cmp = shallow(<SystemName {...props}/>).find('Button');
        cmp.simulate('click');
        expect(props.onChange).toHaveBeenCalledWith('toto');
    });

    let testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        const cmp = shallow(<SystemName {...props}/>).find('Text');
        expect(cmp.props().field.readOnly).toBe(readOnly);
    };
});
