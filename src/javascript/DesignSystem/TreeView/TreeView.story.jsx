import React, {useState} from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs';

import {TreeView} from './';
import doc from './TreeView.md';
import {DSProvider} from '@jahia/design-system-kit';

const ParentComponent = () => {
    const [tree, setTree] = useState([
        {id: 'A',
            label: 'A level1',
            iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg',
            childs: [
                {id: 'A1', label: 'A-1 level2', iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg'},
                {id: 'A2', label: 'A-2 level2'},
                {id: 'A3', label: 'A-3 level2'},
                {id: 'A4', label: 'A-4 level2'}
            ]
        },
        {id: 'B',
            label: 'B level1',
            iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg',
            childs: [
                {id: 'B1', label: 'B-1 level2'},
                {id: 'B2', label: 'B-2 level2'},
                {id: 'B3', label: 'B-3 level2'},
                {id: 'B4', label: 'B-4 level2', childs: [
                    {id: 'B11', label: 'B-1-1 level3'},
                    {id: 'B22', label: 'B-2-2 level3', iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg'},
                    {id: 'B33', label: 'B-3-3 level3'},
                    {id: 'B44', label: 'B-4-4 level3'}
                ]}
            ]
        },
        {
            id: 'C',
            label: 'C level1',
            iconURL: 'https://image.flaticon.com/icons/svg/1973/1973617.svg',
            childs: []
        }
    ]);

    function toogleOpenInTree(level, nodeToModify) {
        return level.map(node => {
            if (node === nodeToModify) {
                node.opened = !node.opened;
            }

            if (node.childs) {
                node.childs = toogleOpenInTree(node.childs, nodeToModify);
            }

            return node;
        });
    }

    const handleNodeClick = node => {
        setTree(toogleOpenInTree(tree, node));
    };

    return (
        <DSProvider>
            <TreeView tree={tree} onNodeClick={handleNodeClick}/>
        </DSProvider>
    );
};

storiesOf('TreeView', module)
    .addDecorator(withKnobs)
    .add(
        'default',
        () => <ParentComponent/>,
        {
            notes: {markdown: doc}
        }
    );
