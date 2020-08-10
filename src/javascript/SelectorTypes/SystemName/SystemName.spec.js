import React from 'react';
import {shallow} from '@jahia/test-framework';

import {SystemNameCmp} from './SystemName';
import {Constants} from '~/ContentEditor.constants';

describe('SystemName component', () => {
    let props;
    beforeEach(() => {
        props = {
            onChange: jest.fn(),
            id: Constants.systemName.name,
            editorContext: {
                uilang: 'en'
            },
            field: {
                name: Constants.systemName.name,
                displayName: Constants.systemName.name,
                readOnly: false,
                selectorType: 'SystemName',
                requiredType: 'STRING'
            }
        };
    });

    it('should be readOnly when formDefinition say so', () => {
        testReadOnly(true);
        testReadOnly(false);
    });

    it('should be readOnly when we are in creating a named content', () => {
        props.editorContext.mode = Constants.routes.baseCreateRoute;
        props.editorContext.name = 'namedContent';
        const cmp = shallow(<SystemNameCmp {...props}/>);
        expect(cmp.props().field.readOnly).toBe(true);
    });

    let testReadOnly = function (readOnly) {
        props.field.readOnly = readOnly;
        const cmp = shallow(<SystemNameCmp {...props}/>);
        expect(cmp.props().field.readOnly).toBe(readOnly);
    };
});
