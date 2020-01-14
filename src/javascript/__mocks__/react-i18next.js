import React from 'react';

export const useTranslation = () => {
    return {
        t: jest.fn(key => `translated_${key}`),
        i18n: {
            loadNamespaces: jest.fn()
        }
    };
};

export const withTranslation = () => Component => props => {
    return <Component {...props} t={key => `translated_${key}`}/>;
};
