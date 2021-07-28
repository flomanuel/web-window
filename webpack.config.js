const webpack = require('webpack');
const path = require('path');

const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const {extendDefaultPlugins} = require("svgo");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const ESLintPlugin = require('eslint-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const appName = process.env.npm_package_name;
const appVersion = process.env.npm_package_version;
const buildMode = process.env.NODE_ENV;
const isDev = buildMode === 'development';

console.info('\n \n============ Building', appName, appVersion, ' ============', '\n');


module.exports = [
    // edit preload file
    {
        mode: buildMode,
        target: 'electron-preload',

        entry: path.join(__dirname, 'src', 'frontend', 'preload.js'),

        output: {
            path: path.join(__dirname, 'dist', 'frontend'),
            filename: "preload.js",
        },
        optimization: {
            minimize: !isDev,
            minimizer: [
                `...`,
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comment: false
                        }
                    },
                    extractComments: false
                })
            ],
        },
        plugins: [
            new ESLintPlugin({
                files: path.join(__dirname, 'src', 'frontend', 'preload.js'),
            }),
            new webpack.DefinePlugin({appName: JSON.stringify(appName)}),
            new webpack.DefinePlugin({appVersion: JSON.stringify(appVersion)}),
        ]
    },
    // edit files for render process
    {
        mode: buildMode,
        devtool: 'source-map',
        target: 'electron-renderer',

        entry: path.join(__dirname, 'src', 'frontend', 'index.js'),

        output: {
            path: path.join(__dirname, 'dist', 'frontend'),
            filename: "index.js"
        },

        module: {
            rules: [
                {
                    test: /\.html$/i,
                    loader: "html-loader"
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: "asset/resource"
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                    options: {presets: ["@babel/env", "@babel/preset-react"]}
                },
                {
                    test: /\.scss$/i,
                    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
                },
            ]
        },
        optimization: {
            minimize: !isDev,
            minimizer: [
                `...`,
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: [
                            "default",
                            {
                                discardComments: {removeAll: true},
                            },
                        ],
                    },
                }),
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comment: false
                        }
                    },
                    extractComments: false
                })
            ],
        },
        plugins: [
            new ESLintPlugin({
                extensions: ['js', 'jsx'],
                files: path.join(__dirname, 'src')
            }),
            new StyleLintPlugin({
                extensions: ['scss'],
                files: path.join(__dirname, 'src')
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css",
            }),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'src', 'frontend', 'index.html'),
                inject: "head",
                hash: true
            }),
            new ImageMinimizerPlugin({
                minimizerOptions: {
                    loader: false,
                    plugins: [
                        ["gifsicle", {interlaced: true}],
                        ["jpegtran", {progressive: true}],
                        ["optipng", {optimizationLevel: 5}],
                        ["svgo",
                            {
                                plugins: extendDefaultPlugins([
                                    {
                                        name: "removeViewBox",
                                        active: false,
                                    },
                                    {
                                        name: "addAttributesToSVGElement",
                                        params: {
                                            attributes: [{xmlns: "http://www.w3.org/2000/svg"}],
                                        },
                                    },
                                ]),
                            },
                        ],
                    ],
                },
            }),
            new webpack.DefinePlugin({appName: JSON.stringify(appName)}),
            new webpack.DefinePlugin({appVersion: JSON.stringify(appVersion)}),
        ]
    },
    // edit files for main process
    {
        mode: buildMode,
        devtool: 'source-map',
        target: 'electron-main',

        entry: path.join(__dirname, 'src', 'main.js'),

        output: {
            path: path.join(__dirname, 'dist'),
            filename: "main.js",
        },

        module: {
            rules: [
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: "asset/resource"
                }
            ]
        },
        optimization: {
            minimize: !isDev,
            minimizer: [
                `...`,
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comment: false
                        }
                    },
                    extractComments: false
                })
            ],
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    // { from: `${__dirname}/src/assets/**/*`, to: './dist/assets/'}
                    {from: path.join(__dirname, 'src', 'assets'), to: path.join(__dirname, 'dist', 'assets')}
                ]
            }),
            new ESLintPlugin({
                extensions: ['js', 'jsx'],
                files: path.join(__dirname, 'src')
            }),
            new ImageMinimizerPlugin({
                minimizerOptions: {
                    loader: false,
                    plugins: [
                        ["gifsicle", {interlaced: true}],
                        ["jpegtran", {progressive: true}],
                        ["optipng", {optimizationLevel: 5}],
                        ["svgo",
                            {
                                plugins: extendDefaultPlugins([
                                    {
                                        name: "removeViewBox",
                                        active: false,
                                    },
                                    {
                                        name: "addAttributesToSVGElement",
                                        params: {
                                            attributes: [{xmlns: "http://www.w3.org/2000/svg"}],
                                        },
                                    },
                                ]),
                            },
                        ],
                    ],
                },
            }),
            new webpack.DefinePlugin({appName: JSON.stringify(appName)}),
            new webpack.DefinePlugin({appVersion: JSON.stringify(appVersion)}),
        ]
    }
]
