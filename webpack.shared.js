const deps = require('./package.json').dependencies;

const sharedDeps = [
    '@babel/polyfill',
    '@material-ui/core',
    'react',
    'react-dom',
    'react-router',
    'react-router-dom',
    'react-i18next',
    'i18next',
    'i18next-xhr-backend',
    'graphql-tag',
    'react-apollo',
    'react-redux',
    'redux',
    'rxjs',
    'whatwg-fetch',
    'dayjs',

    // JAHIA PACKAGES
    '@jahia/ui-extender',
    '@jahia/moonstone',
    '@jahia/moonstone-alpha',
    '@jahia/data-helper',

    // Apollo
    '@apollo/react-common',
    '@apollo/react-components',
    '@apollo/react-hooks',

    // DEPRECATED JAHIA PACKAGES
    '@jahia/design-system-kit',
    '@jahia/react-material',
    '@jahia/icons',

    // Content-editor specific
    'formik'
];

const singletonDeps = [
    'react',
    'react-dom',
    'react-router',
    'react-router-dom',
    'react-i18next',
    'i18next',
    'react-apollo',
    'react-redux',
    'redux',
    '@jahia/moonstone',
    '@jahia/ui-extender',
    '@apollo/react-common',
    '@apollo/react-components',
    '@apollo/react-hooks',
    'formik'
];

const notImported = [];

const shared = sharedDeps.filter(item => deps[item]).reduce((acc, item) => ({
    ...acc,
    [item]: {
        requiredVersion: deps[item]
    }
}), {});

singletonDeps.filter(item => shared[item]).forEach(item => {
    shared[item].singleton = true;
});

notImported.filter(item => shared[item]).forEach(item => {
    shared[item].import = false;
});

module.exports = shared;
