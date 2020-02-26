const path = require('path');

module.exports = {
    target: "node",
    mode: 'production',
    devtool: 'source-map',
    entry: {
        ["plusauth-js"]: "./lib/index.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js",
        library: "plusauth-js",
        libraryTarget: "umd",
        libraryExport: "default"
    },
    module: {
        rules: [
            {
                test: /\.js$/, //using regex to tell babel exactly what files to transcompile
                exclude: /node_modules/, // files to be ignored
                use: {
                    loader: 'babel-loader' // specify the loader
                }
            }
        ]
    }
};
