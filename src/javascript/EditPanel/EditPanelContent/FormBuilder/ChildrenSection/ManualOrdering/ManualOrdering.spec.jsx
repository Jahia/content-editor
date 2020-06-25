import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';


describe('Manual ordering component', () => {
    let props;

    beforeEach(() => {
        props = {
            onChange: jest.fn(),
            value: [{
                name: 'subNode1',
                primaryNodeType: {
                    displayName: 'subNode1',
                    icon: '/icon'
                }
            },
                {
                    name: 'subNode2',
                    primaryNodeType: {
                        displayName: 'subNode2',
                        icon: '/icon'
                    }
                }]
        };
    });

    it('should display the title', () => {
        const cmp = shallowWithTheme(
            <ChildrenOrderField {...props}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.debug()).toContain('content-editor:label.contentEditor.section.listAndOrdering.ordering');
    });

    it('should display  children', () => {
        const cmp = shallowWithTheme(
            <ChildrenOrderField {...props}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('DraggableReference').length).toBe(props.value.length);
    });
});
