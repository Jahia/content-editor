import React from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, text} from '@storybook/addon-knobs';

import {IconLabel} from './IconLabel';
import doc from './IconLabel.md';
import {DSProvider} from '@jahia/design-system-kit';

storiesOf('TreeView', module)
    .addDecorator(withKnobs)
    .add(
        'IconLabel',
        () => (
            <DSProvider>
                <IconLabel label={text('label', 'The label')} iconURL={text('iconURL', 'https://image.flaticon.com/icons/svg/1973/1973617.svg')}/>
            </DSProvider>
        ),
        {
            notes: {markdown: doc}
        }
    );
