var path = require('path');

module.exports = {
    entry: './src/main/javascript/app.js',
    devtool: 'sourcemaps',
    cache: true,
    debug: true,
    output: {
        path: __dirname,
        filename: './target/classes/static/bundle.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react'],
                    plugins: ['transform-object-assign']
                }
            }
        ]
    }
};