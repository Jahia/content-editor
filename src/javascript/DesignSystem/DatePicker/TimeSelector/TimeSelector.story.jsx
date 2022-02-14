import React from 'react';

import {storiesOf} from '@storybook/react';
import {select, withKnobs} from '@storybook/addon-knobs';

import {TimeSelector} from './TimeSelector';
import doc from './TimeSelector.md';
import {dsGenericTheme as theme} from '@jahia/design-system-kit';
import {MuiThemeProvider} from '@material-ui/core';

import {action} from '@storybook/addon-actions';

const wrapperStyle = {
    display: 'flex',
    height: '40vh',
    justifyContent: 'center',
    alignItems: 'center'
};

const hours = new Array(24).fill().reduce(
    (acc, _, i) => {
        return [...acc, `${(i < 10 ? '0' : '')}${i}:00`, `${(i < 10 ? '0' : '')}${i}:30`];
    },
    [null]
);

const after = new Array(24).fill().reduce(
    (acc, _, i) => {
        return [...acc, `${(i < 10 ? '0' : '')}${i}:00`, `${(i < 10 ? '0' : '')}${i}:30`];
    },
    [null]
);

const before = new Array(24).fill().reduce(
    (acc, _, i) => {
        return [...acc, `${(i < 10 ? '0' : '')}${i}:00`, `${(i < 10 ? '0' : '')}${i}:30`];
    },
    [null]
);

const selectedHour = () => select('selected Hour', hours);

const selectedAfter = () => select('Disable After', after);
const selectedBefore = () => select('Disable Before', before);

storiesOf('DatePicker', module)
    .addDecorator(withKnobs)
    .add(
        'Dropdown/time',
        () => (
            <MuiThemeProvider theme={theme}>
                <div style={wrapperStyle}>
                    <TimeSelector
                        disabledHours={{after: selectedAfter(), before: selectedBefore()}}
                        selectedHour={selectedHour()}
                        onHourSelected={action('onHourSelected')}
                        onFocus={action('onFocus')}
                        onBlur={action('onBlur')}
                    />
                </div>
            </MuiThemeProvider>
        ),
        {notes: {markdown: doc}}
    );
