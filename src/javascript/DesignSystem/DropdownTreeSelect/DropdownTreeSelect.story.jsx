import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withKnobs, boolean, text} from '@storybook/addon-knobs';
import {DSProvider} from '@jahia/design-system-kit';
import {DropdownTreeSelect} from './DropdownTreeSelect';

const data = [
    {
        label: 'VP Accounting',
        checked: true,
        children: [
            {
                label: 'iWay',
                children: [
                    {label: 'Universidad de Especialidades del Espíritu Santo'},
                    {label: 'Marmara University'},
                    {label: 'Baghdad College of Pharmacy'}
                ]
            },
            {
                label: 'KDB',
                children: [
                    {label: 'Latvian University of Agriculture'},
                    {label: 'Dublin Institute of Technology'}
                ]
            },
            {
                label: 'Justice',
                children: [
                    {label: 'Baylor University'},
                    {label: 'Massachusetts College of Art'},
                    {label: 'Universidad Técnica Latinoamericana'},
                    {label: 'Saint Louis College'},
                    {label: 'Scott Christian University'}
                ]
            },
            {
                label: 'Utilization Review',
                children: [
                    {label: 'University of Minnesota - Twin Cities Campus'},
                    {label: 'Moldova State Agricultural University'},
                    {label: 'Andrews University'},
                    {label: 'Usmanu Danfodiyo University Sokoto'}
                ]
            },
            {
                label: 'Norton Utilities',
                children: [
                    {label: 'Universidad Autónoma del Caribe'},
                    {label: 'National University of Uzbekistan'},
                    {label: 'Ladoke Akintola University of Technology'},
                    {label: 'Kohat University of Science and Technology  (KUST)'},
                    {label: 'Hvanneyri Agricultural University'}
                ]
            }
        ]
    }
];

storiesOf('DropdownTreeSelect', module)
    .addDecorator(withKnobs)
    .add(
        'default',
        () => (
            <DSProvider>
                <DropdownTreeSelect
                    data={data}
                    noMatchesLabel={text('no match label', 'ho ho ho, there is no result')}
                    readOnly={boolean('readOnly', false)}
                    disabled={boolean('disabled', false)}
                    onChange={action('onChange')}
                    onAction={action('onAction')}
                    onNodeToggle={action('onNodeToggle')}
                />
            </DSProvider>
        )
    );
