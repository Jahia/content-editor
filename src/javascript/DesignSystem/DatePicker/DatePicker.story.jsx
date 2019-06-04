import React from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, select} from '@storybook/addon-knobs';
import {action} from '@storybook/addon-actions';

import {DatePicker} from './DatePicker';
import doc from './DatePicker.md';
import {dsGenericTheme as theme} from '@jahia/ds-mui-theme';
import {MuiThemeProvider} from '@material-ui/core';

const wrapperStyle = {
    display: 'flex',
    height: '75vh',
    justifyContent: 'center',
    alignItems: 'center'
};

const lang = () => select('lang', ['en', 'fr', 'de']);

storiesOf('DatePicker', module)
    .addDecorator(withKnobs)
    .add(
        'Dropdown/date',
        () => (
            <MuiThemeProvider theme={theme}>
                <div style={wrapperStyle}>
                    <DatePicker
                        lang={lang() || 'en'}
                        onSelectDateTime={action('onSelectDateTime')}
                    />
                </div>
            </MuiThemeProvider>
        ),
        {notes: {markdown: doc}}
    )
    .add(
        'Dropdown/datetime',
        () => (
            <MuiThemeProvider theme={theme}>
                <div style={wrapperStyle}>
                    <DatePicker
                        lang={lang() || 'en'}
                        variant="datetime"
                        onSelectDateTime={action('onSelectDateTime')}
                    />
                </div>
            </MuiThemeProvider>
        ),
        {notes: {markdown: doc}}
    );
