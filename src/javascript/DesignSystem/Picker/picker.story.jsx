import React from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, boolean, text} from '@storybook/addon-knobs';

import {Picker} from './Picker';
import doc from './Picker.md';
import {dsGenericTheme as theme} from '@jahia/design-system-kit';
import {MuiThemeProvider} from '@material-ui/core';
import {InsertDriveFile} from '@material-ui/icons';

storiesOf('picker', module)
    .addDecorator(withKnobs)
    .add(
        'picker/empty',
        () => (
            <MuiThemeProvider theme={theme}>
                <Picker
                    readOnly={boolean('readOnly', false)}
                    emptyLabel={text('pickerLabel', 'add image')}
                    emptyIcon={<InsertDriveFile/>}
                />
            </MuiThemeProvider>
        ),
        {
            notes: {markdown: doc}
        }
    )
    .add(
        'picker/filled',
        () => (
            <MuiThemeProvider theme={theme}>
                <Picker
                    readOnly={boolean('readOnly', false)}
                    fieldData={{
                        url:
                            'http://www.open-source-guide.com/var/site_smile/storage/images/guide-os/solutions/applications/cms/jahia-digital-factory/362440-239-fre-FR/Jahia-Digital-Factory_logo_solution_categorie.png',
                        name: 'Jahia',
                        info: 'best company in the world'
                    }}
                />
            </MuiThemeProvider>
        ),
        {
            notes: {markdown: doc}
        }
    );
