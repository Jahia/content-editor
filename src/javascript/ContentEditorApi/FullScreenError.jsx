import React from 'react';
import {ErrorBoundary} from '@jahia/jahia-ui-root';

export const FullScreenError = props => {
    return (
        <div style={{height: '100vh', display: 'flex'}}>
            {React.cloneElement(ErrorBoundary.defaultProps.fallback, {
                ...props, goBack: () => {
                    const cePartIndex = window.location.href.indexOf('#(contentEditor');

                    if (cePartIndex !== -1) {
                        window.location.href = window.location.href.slice(0, cePartIndex);
                    } else {
                        window.history.back();
                    }
                }
            })}
        </div>
    );
};
