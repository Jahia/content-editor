import React from 'react';

import {storiesOf} from '@storybook/react';
import {object, select, text, withKnobs} from '@storybook/addon-knobs';

import {InfoPanel, InfoPanelVariant} from './index';
import doc from './InfoPanel.md';
import {DSProvider} from '@jahia/design-system-kit';

const defaultInfos = [
    {label: 'uuid', value: 'zertyuioiuytretyuiuyt'},
    {label: 'uuid2', value: 'zer'},
    {label: 'uuid3', value: 'erze'},
    {label: 'uuid4', value: 'lelrzkre'}
];

storiesOf('InfoPanel', module)
    .addDecorator(withKnobs)
    .add(
        'default',
        () => (
            <DSProvider>
                <div style={{width: '300px'}}>
                    <InfoPanel
                    panelTitle={text('panelTitle', 'Details')}
                    infos={object('infos', defaultInfos)}
                    variant={select('variant', InfoPanelVariant)}
                    />
                </div>
            </DSProvider>
        ),
        {
            notes: {markdown: doc}
        }
    );
