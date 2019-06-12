import React from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, select, boolean, text} from '@storybook/addon-knobs';

import {DatePickerInput} from './DatePickerInput';
import doc from './DatePickerInput.md';
import {dsGenericTheme as theme} from '@jahia/design-system-kit';
import {MuiThemeProvider} from '@material-ui/core';

import '../../date.config';

const lang = () => select('lang', ['en', 'fr', 'de']);
const readOnly = () => boolean('readOnly', false);
const displayDateFormat = () => text('displayDateFormat', '');

storiesOf('DatePickerInput', module)
    .addDecorator(withKnobs)
    .add(
        'default',
        () => (
            <MuiThemeProvider theme={theme}>
                <DatePickerInput lang={lang() || 'en'} readOnly={readOnly()} displayDateFormat={displayDateFormat()}/>
            </MuiThemeProvider>
        ),
        {notes: {markdown: doc}}
    )
    .add(
        'datetime',
        () => (
            <MuiThemeProvider theme={theme}>
                <DatePickerInput lang={lang() || 'en'} variant="datetime" readOnly={readOnly()}/>
            </MuiThemeProvider>
        ),
        {notes: {markdown: doc}}
    );
