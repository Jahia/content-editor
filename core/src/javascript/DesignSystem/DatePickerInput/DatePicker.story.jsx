import React from 'react';

import {storiesOf} from '@storybook/react';
import {boolean, select, text, withKnobs} from '@storybook/addon-knobs';

import {DatePickerInput} from './DatePickerInput';
import doc from './DatePickerInput.md';
import {DSProvider} from '@jahia/design-system-kit';

import '../../date.config';

const lang = () => select('lang', ['en', 'fr', 'de']);
const readOnly = () => boolean('readOnly', false);
const displayDateFormat = () => text('displayDateFormat', '');

storiesOf('DatePickerInput', module)
    .addDecorator(withKnobs)
    .add(
        'default',
        () => (
            <DSProvider>
                <DatePickerInput lang={lang() || 'en'} readOnly={readOnly()} displayDateFormat={displayDateFormat()}/>
            </DSProvider>
        ),
        {notes: {markdown: doc}}
    )
    .add(
        'datetime',
        () => (
            <DSProvider>
                <DatePickerInput lang={lang() || 'en'} variant="datetime" readOnly={readOnly()}/>
            </DSProvider>
        ),
        {notes: {markdown: doc}}
    );
