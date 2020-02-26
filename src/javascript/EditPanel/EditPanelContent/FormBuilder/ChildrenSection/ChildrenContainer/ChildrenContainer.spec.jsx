import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {ChildrenContainer} from './ChildrenContainer';

jest.mock('~/ContentEditor.context', () => {
    let contextmock;
    return {
        useContentEditorContext: () => {
            return contextmock;
        },
        setContext: c => {
            contextmock = c;
        }
    };
});

import {setContext} from '~/ContentEditor.context';

describe('ChildrenContainer component', () => {
    let context = {
        nodeData: {
            children: {
                nodes: [{
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
            }
        }
    };

    it('should display an the title', () => {
        setContext(context);
        const cmp = shallowWithTheme(
            <ChildrenContainer/>,
            {},
            dsGenericTheme
        );

        expect(cmp.debug()).toContain('content-editor:label.contentEditor.section.listAndOrdering.ordering');
    });

    it('should display  children', () => {
        setContext(context);
        const cmp = shallowWithTheme(
            <ChildrenContainer/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('DraggableReference').length).toBe(context.nodeData.children.nodes.length);
    });
});
