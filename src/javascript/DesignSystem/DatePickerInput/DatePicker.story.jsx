import React from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, select, boolean} from '@storybook/addon-knobs';

import {DatePickerInput} from './DatePickerInput';
import doc from './DatePickerInput.md';
import {dsGenericTheme as theme} from '@jahia/ds-mui-theme';
import {MuiThemeProvider} from '@material-ui/core';

import '../../date.config';

const lang = () => select('lang', ['en', 'fr', 'de']);
const readOnly = () => boolean('readOnly', false);

storiesOf('DatePickerInput', module)
    .addDecorator(withKnobs)
    .add(
        'default',
        () => (
            <MuiThemeProvider theme={theme}>
                <DatePickerInput lang={lang() || 'en'} readOnly={readOnly()}/>
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
