import React from 'react';
import {ErrorBoundary} from '@jahia/jahia-ui-root';

export const FullScreenError = props => {
    return (
        <div style={{height: '100vh', display: 'flex'}}>
            {React.cloneElement(ErrorBoundary.defaultProps.fallback, {
                ...props, goBack: () => {
                    window.location.reload();
                }
            })}
        </div>
    );
};
