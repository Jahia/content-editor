import React from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, select} from '@storybook/addon-knobs';

import {TimeSelector} from './TimeSelector';
import doc from './TimeSelector.md';
import {dsGenericTheme as theme} from '@jahia/ds-mui-theme';
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
        return [...acc, `${i}:00`, `${i}:30`];
    },
    [null]
);

const selectedHour = () => select('selectedHour', hours);

storiesOf('DatePicker', module)
    .addDecorator(withKnobs)
    .add(
        'Dropdown/time',
        () => (
            <MuiThemeProvider theme={theme}>
                <div style={wrapperStyle}>
                    <TimeSelector
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
