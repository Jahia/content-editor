import React from 'react';

import {storiesOf} from '@storybook/react';
import {text, withKnobs} from '@storybook/addon-knobs';

import {LabelledInfo} from './index';
import doc from './LabelledInfo.md';
import {DSProvider} from '@jahia/design-system-kit';

storiesOf('LabelledInfo', module)
    .addDecorator(withKnobs)
    .add(
        'default',
        () => (
            <DSProvider>
                <LabelledInfo label={text('label', 'The label')} value={text('value', 'The value')}/>
            </DSProvider>
        ),
        {
            notes: {markdown: doc}
        }
    );
