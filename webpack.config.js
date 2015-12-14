module.exports = {
  entry: "./client/app.js",
  output: {
    filename: "./public/bundle.js"
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel?presets[]=es2015'},
      { test: /\.css$/, loader: "style-loader!css-loader!postcss-loader"}]
  },
   postcss: [
    require('lost')
  ]
};