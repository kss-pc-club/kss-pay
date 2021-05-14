const path = require('path')

module.exports = {
  resolve: {
    modules: ['node_modules', 'es2015', 'ts-loader','ignore-loader'],
    extensions: ['.ts','.js','.d.ts']
  },
  module: {
    rules: [{
      test: /(?<!\.d)\.ts/,
      loader: 'ts-loader',
    },{
      test: /\.d\.ts/,
      loader: 'ignore-loader',
    },]
  },
  entry: './src/main.ts',
  output: {
    path: path.join(__dirname,"public"),
    filename: 'bundle.js',
  },
  // mode: "development",
  mode: 'production',
}
