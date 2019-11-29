import React from 'react';

import {storiesOf} from '@storybook/react';
import {select, withKnobs} from '@storybook/addon-knobs';
import {DSProvider} from '@jahia/design-system-kit';
import SiteSwitcher from './SiteSwitcher';

const siteNodes = [
    {
        name: 'digitall',
        displayName: 'Digitall',
        uuid: '1234'
    },
    {
        name: 'systemsite',
        displayName: 'System site',
        uuid: '4567'
    }
];

const selectSiteKey = () => select('siteKey', ['digitall', 'systemsite']);

storiesOf('SiteSwitcher', module)
    .addDecorator(withKnobs)
    .add(
        'default',
        () => (
            <DSProvider>
                <div style={{background: 'black'}}>
                    <SiteSwitcher
                        id="site-switcher"
                        siteKey={selectSiteKey() || 'digitall'}
                        siteNodes={siteNodes}
                        onSelectSite={() => {}}
                    />
                </div>
            </DSProvider>
        )
    );
