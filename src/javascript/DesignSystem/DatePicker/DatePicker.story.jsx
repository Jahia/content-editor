import React from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, select, text, boolean} from '@storybook/addon-knobs';
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

const disabledBefore = () => text('DisableBefore', '');
const disabledBeforeInclude = () => boolean('IncludeBefore', false);

const disabledAfter = () => text('DisableAfter', '');
const disabledAfterInclude = () => boolean('IncludeAfter');

const lang = () => select('lang', ['en', 'fr', 'de']);

const isValidDate = date => date && date.toString() !== 'Invalid Date';

function getDisabled(dateBefore, beforeInclude, dateAfter, afterInclude) {
    const disabled = {};
    if (isValidDate(dateBefore)) {
        disabled.before = {
            date: dateBefore,
            include: beforeInclude
        };
    }

    if (isValidDate(dateAfter)) {
        disabled.after = {
            date: dateAfter,
            include: afterInclude
        };
    }

    return disabled;
}

storiesOf('DatePicker', module)
    .addDecorator(withKnobs)
    .add(
        'Dropdown/date',
        () => {
            const before = disabledBefore();
            const dateBefore = new Date(before);
            const beforeInclude = disabledBeforeInclude();
            const dateAfter = disabledAfter();
            const afterInclude = disabledAfterInclude();
            const disabled = getDisabled(dateBefore, beforeInclude, dateAfter, afterInclude);
            return (
                <MuiThemeProvider theme={theme}>
                    <div style={wrapperStyle}>
                        <DatePicker
                            disabledDays={[disabled]}
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
            const before = disabledBefore();
            const dateBefore = new Date(before);
            const beforeInclude = disabledBeforeInclude();
            const dateAfter = disabledAfter();
            const afterInclude = disabledAfterInclude();
            const disabled = getDisabled(dateBefore, beforeInclude, dateAfter, afterInclude);
            return (
                <MuiThemeProvider theme={theme}>
                    <div style={wrapperStyle}>
                        <DatePicker
                            disabledDays={[disabled]}
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
