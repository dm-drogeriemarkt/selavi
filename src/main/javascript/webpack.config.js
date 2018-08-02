const path = require('path');


module.exports = () => {
  /* eslint-disable no-console */
  console.log('====================================');
  console.log('-> Environment:', process.env.NODE_ENV);
  console.log('-> Path:', path.resolve(__dirname, '../../../target/classes/static'));
  console.log('====================================');

  return ({
    entry: './src/app.js',
    output: {
      path: path.resolve(__dirname, '../../../target/classes/static'),
      filename: 'bundle.js',
      libraryTarget: 'umd',
      library: 'lib'
    },
    resolve: {
      modules: [path.resolve(__dirname, 'node_modules')],
      extensions: ['.js', '.jsx', '.json'],
      mainFields: ['loader', 'main'],
      alias: {
        components: path.resolve(__dirname, 'src/components/')
      }
    },
    optimization: {
      minimize: process.env.NODE_ENV === 'production'
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.js|jsx$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['react', 'env', 'es2015'],
            plugins: ['transform-class-properties', 'transform-object-rest-spread']
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
          use: 'base64-inline-loader'
        }
      ]
    }
  });
};
