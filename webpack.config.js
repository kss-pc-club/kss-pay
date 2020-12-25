const path = require('path')

module.exports = {
  resolve: {
    modules: ['node_modules', 'es2015', 'ts-loader'],
    extensions: ['.ts','.js']
  },
  module: {
    rules: [{
      test: /\.ts/,
      loader: 'ts-loader'
    }]
  },
  entry: './src/main.ts',
  output: {
    path: path.join(__dirname,"public"),
    filename: 'bundle.js',
  },
  // mode: "development",
  mode: 'production',
}
