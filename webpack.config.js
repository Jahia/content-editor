const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const moonstone = require("@jahia/moonstone/dist/rulesconfig-wp");
const {CycloneDxWebpackPlugin} = require('@cyclonedx/webpack-plugin');
const getModuleFederationConfig = require('@jahia/webpack-config/getModuleFederationConfig');
const packageJson = require('./package.json');

/** @type {import('@cyclonedx/webpack-plugin').CycloneDxWebpackPluginOptions} */
const cycloneDxWebpackPluginOptions = {
    specVersion: '1.4',
    rootComponentType: 'library',
    outputLocation: './bom'
};

module.exports = (env, argv) => {
    let _argv = argv || {};

    let config = {
        entry: {
            main: path.resolve(__dirname, 'src/javascript/index')
        },
        output: {
            path: path.resolve(__dirname, 'src/main/resources/javascript/apps/'),
            filename: 'content-editor.bundle.js',
            chunkFilename: '[name].content-editor.[chunkhash:6].js'
        },
        resolve: {
            mainFields: ['module', 'main'],
            extensions: ['.mjs', '.js', '.jsx', 'json', '.scss'],
            alias: {
                '~': path.resolve(__dirname, './src/javascript'),
            },
            fallback: { "url": false }
        },
        module: {
            rules: [
                ...moonstone,
                {
                    test: /\.m?js$/,
                    type: 'javascript/auto'
                },
                {
                    test: /\.jsx?$/,
                    include: [path.join(__dirname, 'src')],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    modules: false,
                                    targets: {chrome: '60', edge: '44', firefox: '54', safari: '12'}
                                }],
                                '@babel/preset-react'
                            ],
                            plugins: [
                                'lodash',
                                '@babel/plugin-syntax-dynamic-import'
                            ]
                        }
                    }
                },
                {
                    test: /\.scss$/i,
                    include: [path.join(__dirname, 'src')],
                    sideEffects: true,
                    use: [
                        'style-loader',
                        // Translates CSS into CommonJS
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    mode: 'local'
                                }
                            }
                        },
                        // Compiles Sass to CSS
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg|png)(\?v=\d+\.\d+\.\d+)?$/,
                    type: 'asset/resource',
                    dependency: { not: ['url'] }
                }
            ]
        },
        plugins: [
            new ModuleFederationPlugin(getModuleFederationConfig(packageJson, {
            library: { type: "assign", name: "appShell.remotes.copyToOtherLanguages" },
                exposes: {
                    '.': './src/javascript/shared'
                },

                remotes: {
                    '@jahia/jcontent': 'appShell.remotes.jcontent',
                    '@jahia/jahia-ui-root': 'appShell.remotes.jahiaUi'
                },
            })),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [`${path.resolve(__dirname, 'src/main/resources/javascript/apps/')}/**/*`],
                verbose: false
            }),
            new CopyWebpackPlugin({
                patterns: [{
                    from: './package.json',
                    to: ''
                }]
            }),
            new CaseSensitivePathsPlugin(),
            new CycloneDxWebpackPlugin(cycloneDxWebpackPluginOptions)
        ],
        mode: 'development'
    };

    config.devtool = (_argv.mode === 'production') ? 'source-map' : 'eval-source-map';

    if (_argv.analyze) {
        config.devtool = 'source-map';
        config.plugins.push(new BundleAnalyzerPlugin());
    }

    return config;
};
