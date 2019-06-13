import React from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, boolean} from '@storybook/addon-knobs';

import {Input} from './Input';
import doc from './Input.md';
import {dsGenericTheme as theme} from '@jahia/design-system-kit';
import {MuiThemeProvider} from '@material-ui/core';

import {Close, Search} from '@material-ui/icons';

import '../../date.config';
import {action} from '@storybook/addon-actions';

const readOnly = () => boolean('readOnly', false);
const disabled = () => boolean('disabled', false);
const error = () => boolean('error', false);
const onBlur = () => action('onBlur');
const onChange = () => action('onChange');
const onFocus = () => action('onFocus');

storiesOf('Input', module)
    .addDecorator(withKnobs)
    .add(
        'default',
        () => (
            <MuiThemeProvider theme={theme}>
                <Input
                    disabled={disabled()}
                    error={error()}
                    readOnly={readOnly()}
                    onBlur={onBlur()}
                    onChange={onChange()}
                    onFocus={onFocus()}
                />
            </MuiThemeProvider>
        ),
        {notes: {markdown: doc}}
    )
    .add(
        'icon',
        () => (
            <MuiThemeProvider theme={theme}>
                <Input variant={{icon: <Search/>}}
                       disabled={disabled()}
                       error={error()}
                       readOnly={readOnly()}
                       onBlur={onBlur()}
                       onChange={onChange()}
                       onFocus={onFocus()}
                />
            </MuiThemeProvider>
        ),
        {notes: {markdown: doc}}
    ).add(
        'interactive',
        () => (
            <MuiThemeProvider theme={theme}>
                <Input variant={{interactive: <Close/>}}
                       disabled={disabled()}
                       error={error()}
                       readOnly={readOnly()}
                       onBlur={onBlur()}
                       onChange={onChange()}
                       onFocus={onFocus()}
            />
            </MuiThemeProvider>
        ),
        {notes: {markdown: doc}}
    );
