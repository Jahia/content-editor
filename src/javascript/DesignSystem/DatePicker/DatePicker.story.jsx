import React from 'react';

import {storiesOf} from '@storybook/react';
import {select, text, withKnobs} from '@storybook/addon-knobs';
import {action} from '@storybook/addon-actions';

import {DatePicker} from './DatePicker';
import doc from './DatePicker.md';
import {DSProvider} from '@jahia/design-system-kit';

const wrapperStyle = {
    display: 'flex',
    height: '75vh',
    justifyContent: 'center',
    alignItems: 'center'
};
const beforeDefaultDate = new Date().toISOString().replace('Z', '');
const disabledBefore = () => text('Disable Before', beforeDefaultDate);

const disabledAfter = () => text('Disable After', '');

const lang = () => select('lang', ['en', 'fr', 'de']);

const isValidDate = date => date && date.toString() !== 'Invalid Date';

function getDisabledDays(dateBefore, beforeInclude, dateAfter) {
    const disabledDays = [];
    if (isValidDate(dateBefore)) {
        disabledDays.push({before: new Date(dateBefore)});
    }

    if (isValidDate(dateAfter)) {
        disabledDays.push({after: new Date(dateAfter)});
    }

    return disabledDays;
}

storiesOf('DatePicker', module)
    .addDecorator(withKnobs)
    .add(
        'Dropdown/date',
        () => {
            const dateBefore = disabledBefore();
            const dateAfter = disabledAfter();
            const disabledDays = getDisabledDays(dateBefore, dateAfter);
            return (
                <DSProvider>
                    <div style={wrapperStyle}>
                        <DatePicker
                            disabledDays={disabledDays}
                            lang={lang() || 'en'}
                            onSelectDateTime={action('onSelectDateTime')}
                        />
                    </div>
                </DSProvider>
            );
        },
        {notes: {markdown: doc}}
    )
    .add(
        'Dropdown/datetime',
        () => {
            const dateBefore = disabledBefore();
            const dateAfter = disabledAfter();
            const disabledDays = getDisabledDays(dateBefore, dateAfter);
            return (
                <DSProvider>
                    <div style={wrapperStyle}>
                        <DatePicker
                            disabledDays={disabledDays}
                            lang={lang() || 'en'}
                            variant="datetime"
                            onSelectDateTime={action('onSelectDateTime')}
                        />
                    </div>
                </DSProvider>
            );
        },
        {notes: {markdown: doc}}
    );
