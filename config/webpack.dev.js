let webpack = require("webpack");
let htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: './src/index.js',
    devtool: "#eval-source-map",
    plugins: [
        new htmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html",
            hash: true,
            title: "中国象棋",
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        }
                    }
                ],
            }
        ]
    },
    devServer: {
        contentBase: "./dist",
        host: "localhost",
        port: "8080",
        hot: true,
    },
};