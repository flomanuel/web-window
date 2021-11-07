const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const webpack = require("webpack");
const {extendDefaultPlugins} = require("svgo");

const appName = process.env.npm_package_name;
const appVersion = process.env.npm_package_version;
const buildMode = process.env.NODE_ENV;
const isDev = buildMode === 'development';

module.exports = {
    mode: buildMode,
    devtool: 'source-map',
    target: 'electron-main',
    entry: path.join(__dirname, '..', 'src', 'main.js'),
    output: {
        path: path.join(__dirname, '..', 'dist'),
        filename: "main.js",
    },
    resolve: {
        extensions: ['.jsx', '.js'],
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
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false
                    }
                },
                extractComments: false
            })
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: path.join(__dirname, '..', 'src', 'assets'), to: path.join(__dirname, '..', 'dist', 'assets')}
            ]
        }),
        new ESLintPlugin({
            extensions: ['js', 'jsx'],
            files: path.join(__dirname, '..', 'src')
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
    ],
    externalsPresets: {
        node: true,
        electronMain: true
    }
}
