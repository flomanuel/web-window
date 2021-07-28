const {extendDefaultPlugins} = require("svgo");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const webpack = require("webpack");

const appName = process.env.npm_package_name;
const appVersion = process.env.npm_package_version;
const buildMode = process.env.NODE_ENV;
const isDev = buildMode === 'development';

module.exports = {
    mode: buildMode,
    devtool: 'source-map',
    target: 'electron-renderer',
    entry: path.join(__dirname, '..', 'src', 'frontend', 'index.js'),
    output: {
        path: path.join(__dirname, '..', 'dist', 'frontend'),
        filename: "index.js"
    },
    resolve: {
        extensions: ['.jsx', '.js'],
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
                test: /\.scss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {presets: ["@babel/env", "@babel/preset-react"]}
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
            files: path.join(__dirname, '..', 'src')
        }),
        new StyleLintPlugin({
            extensions: ['scss'],
            files: path.join(__dirname, '..', 'src')
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '..', 'src', 'frontend', 'index.html'),
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
    ],
    externalsPresets: {
        node: true,
        electronRenderer: true
    }
}
