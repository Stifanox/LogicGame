var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index:'./src/index.js'
    },
    output: {
      filename: '[name].js', 
    },
    devtool: "source-map",
    mode: 'development', // none, development, production
    devServer: {
        port: 8080
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: './index.html', //relative to root of the application
            title:"LogicGame",
            template: './src/index.html',
            chunks:['index']
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
                        name: 'images/[hash]-[name].[ext]'
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