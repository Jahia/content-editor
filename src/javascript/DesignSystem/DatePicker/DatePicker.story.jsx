import React from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, select, text} from '@storybook/addon-knobs';
import {action} from '@storybook/addon-actions';

import {DatePicker} from './DatePicker';
import doc from './DatePicker.md';
import {dsGenericTheme as theme} from '@jahia/design-system-kit';
import {MuiThemeProvider} from '@material-ui/core';

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
                <MuiThemeProvider theme={theme}>
                    <div style={wrapperStyle}>
                        <DatePicker
                            disabledDays={disabledDays}
                            lang={lang() || 'en'}
                            onSelectDateTime={action('onSelectDateTime')}
                        />
                    </div>
                </MuiThemeProvider>
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
                <MuiThemeProvider theme={theme}>
                    <div style={wrapperStyle}>
                        <DatePicker
                            disabledDays={disabledDays}
                            lang={lang() || 'en'}
                            variant="datetime"
                            onSelectDateTime={action('onSelectDateTime')}
                        />
                    </div>
                </MuiThemeProvider>
            );
        },
        {notes: {markdown: doc}}
    );
