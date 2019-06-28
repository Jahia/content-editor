import React from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, boolean} from '@storybook/addon-knobs';

import {Input} from './Input';
import doc from './Input.md';
import {DSProvider} from '@jahia/design-system-kit';

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
    .add('default',
        () => (
            <DSProvider>
                <Input
                    disabled={disabled()}
                    error={error()}
                    readOnly={readOnly()}
                    onBlur={onBlur()}
                    onChange={onChange()}
                    onFocus={onFocus()}
                />
            </DSProvider>
        ),
        {notes: {markdown: doc}}
    )
    .add('number',
        () => (
            <DSProvider>
                <Input
                    type="number"
                    disabled={disabled()}
                    error={error()}
                    readOnly={readOnly()}
                    onBlur={onBlur()}
                    onChange={onChange()}
                    onFocus={onFocus()}
                />
            </DSProvider>
        ),
        {notes: {markdown: doc}}
    )
    .add('number long',
        () => (
            <DSProvider>
                <Input
                    type="number"
                    decimalScale={0}
                    disabled={disabled()}
                    error={error()}
                    readOnly={readOnly()}
                    onBlur={onBlur()}
                    onChange={onChange()}
                    onFocus={onFocus()}
                />
            </DSProvider>
        ),
        {notes: {markdown: doc}}
    )
    .add('number decimal',
        () => (
            <DSProvider>
                <Input
                    type="number"
                    decimalSeparator="."
                    decimalScale={5}
                    disabled={disabled()}
                    error={error()}
                    readOnly={readOnly()}
                    onBlur={onBlur()}
                    onChange={onChange()}
                    onFocus={onFocus()}
                />
            </DSProvider>
        ),
        {notes: {markdown: doc}}
    )
    .add('icon',
        () => (
            <DSProvider>
                <Input variant={{icon: <Search/>}}
                       disabled={disabled()}
                       error={error()}
                       readOnly={readOnly()}
                       onBlur={onBlur()}
                       onChange={onChange()}
                       onFocus={onFocus()}
                />
            </DSProvider>
        ),
        {notes: {markdown: doc}}
    )
    .add('interactive',
        () => (
            <DSProvider>
                <Input variant={{interactive: <Close/>}}
                       disabled={disabled()}
                       error={error()}
                       readOnly={readOnly()}
                       onBlur={onBlur()}
                       onChange={onChange()}
                       onFocus={onFocus()}
                />
            </DSProvider>
        ),
        {notes: {markdown: doc}}
    );
