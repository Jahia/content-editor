import React from 'react';
import {Loader} from '@jahia/moonstone';

export const LoaderOverlay = () => (
    <div className="flexFluid flexCol_center alignCenter" style={{backgroundColor: 'var(--color-light)'}}>
        <Loader size="big"/>
    </div>
);
