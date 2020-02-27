const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

// get manifest
var normalizedPath = require("path").join(__dirname, "./target/dependency");
var manifest = "";
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    manifest = "./target/dependency/" + file
    console.log("use manifest " + manifest);
});

module.exports = (env, argv) => {
    let _argv = argv || {};
    let config = {
        entry: {
            main: [path.resolve(__dirname, 'src/javascript/index')]
        },
        output: {
            path: path.resolve(__dirname, 'src/main/resources/javascript/apps/'),
            filename: 'content-editor-ext.bundle.js',
            chunkFilename: '[name].content-editor.[chunkhash:6].js'
        },
        resolve: {
            mainFields: ['module', 'main'],
            extensions: ['.mjs', '.js', '.jsx', 'json'],
            alias: {
                '~': path.resolve(__dirname, './src/javascript'),
            }
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
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.scss$/i,
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
                    test: /\.(png|svg)$/,
                    loaders: ['file-loader']
                }
            ]
        },
        plugins: [
            new webpack.DllReferencePlugin({
                manifest: require(manifest)
            }),
            new CleanWebpackPlugin({
              cleanOnceBeforeBuildPatterns: [`${path.resolve(__dirname, 'src/main/resources/javascript/apps/')}/**/*`],
              verbose: false
            }),
            new CopyWebpackPlugin([{ from: './package.json', to: '' }]),
            new CaseSensitivePathsPlugin()
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
