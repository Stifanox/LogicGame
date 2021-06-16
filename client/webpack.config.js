var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path")

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname + "/../server/dist")
    },
    devtool: "source-map",
    mode: 'development', // none, development, production
    devServer: {
        open: true,
        openPage: "http://localhost:3000",
        port: 8080
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: './index.html', //relative to root of the application
            title: "Giercowanie",
            template: './src/index.html',
            chunks: ['index']
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: '[name].[ext]'
                    }
                }]
            },
            {
                test: /.(fbx)$/i,
                type: 'asset/resource',
            }
        ]
    },
};