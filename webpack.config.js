const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, argv) => {
    let config = {
        entry: {
            main: [path.resolve(__dirname, 'src/javascript/register')]
        },
        output: {
            path: path.resolve(__dirname, 'src/main/resources/javascript/apps/'),
            filename: 'content-editor-ext.bundle.js',
            chunkFilename: '[name].content-editor.[chunkhash:6].js'
        },
        optimization: {
            splitChunks: {
                maxSize: 4000000
            }
        },
        resolve: {
            mainFields: ['module', 'main'],
            extensions: ['.mjs', '.js', '.jsx', 'json']
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    include: [path.join(__dirname, 'src')],
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            ['@babel/preset-env', {modules: false, targets: {safari: '7', ie: '10'}}],
                            '@babel/preset-react'
                        ],
                        plugins: [
                            'lodash',
                            '@babel/plugin-syntax-dynamic-import'
                        ]
                    }
                }
            ]
        },
        plugins: [
            new webpack.DllReferencePlugin({
                manifest: require('./target/dependency/dx-commons-webpack-1.0.0-SNAPSHOT-manifest')
            }),
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|fr|de/),
            new CleanWebpackPlugin(path.resolve(__dirname, 'src/main/resources/javascript/apps/'), {verbose: false})
        ],
        mode: 'development'
    };

    config.devtool = (argv.mode === 'production') ? 'source-map' : 'eval-source-map';

    if (argv.watch) {
        config.module.rules.push({
            test: /\.jsx?$/,
            include: [path.join(__dirname, 'src')],
            exclude: /node_modules/,
            enforce: 'pre',
            loader: 'eslint-loader',
            options: {
                quiet: true,
                fix: true
            }
        });
    }

    if (argv.analyze) {
        config.devtool = 'source-map';
        config.plugins.push(new BundleAnalyzerPlugin());
    }

    return config;
};
