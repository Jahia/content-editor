import React from 'react';

import {storiesOf} from '@storybook/react';
import {boolean, text, withKnobs} from '@storybook/addon-knobs';

import {ReferenceCard} from './ReferenceCard';
import doc from './ReferenceCard.md';
import {DSProvider} from '@jahia/design-system-kit';
import {File} from '@jahia/moonstone';

storiesOf('ReferenceCard', module)
    .addDecorator(withKnobs)
    .add(
        'card/empty',
        () => (
            <DSProvider>
                <ReferenceCard
                    isReadOnly={boolean('readOnly', false)}
                    emptyLabel={text('referenceCardLabel', 'add image')}
                    emptyIcon={<File/>}
                />
            </DSProvider>
        ),
        {
            notes: {markdown: doc}
        }
    )
    .add(
        'card/filled',
        () => (
            <DSProvider>
                <ReferenceCard
                    isReadOnly={boolean('readOnly', false)}
                    fieldData={{
                        url:
                            'http://www.open-source-guide.com/var/site_smile/storage/images/guide-os/solutions/applications/cms/jahia-digital-factory/362440-239-fre-FR/Jahia-Digital-Factory_logo_solution_categorie.png',
                        name: 'Jahia',
                        info: 'best company in the world'
                    }}
                />
            </DSProvider>
        ),
        {
            notes: {markdown: doc}
        }
    );
