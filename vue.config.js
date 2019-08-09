const webpack = require('webpack');
const env = {};
const dotenv = require('dotenv');
const now = process.env.NODE_ENV;

const fs = require('fs');
let envConfig = {};
try {
  envConfig = dotenv.parse(fs.readFileSync(__dirname + '/.env.' + now));
} catch (e) {
  console.log('not env config', e);
  process.exit();
}
//console.log('el env es ', process.env);
for (let k in envConfig) {
  if (k.startsWith('VUE_APP_')) {
    process.env[k] = envConfig[k];
    env['process.env.' + k] = envConfig[k];
  }
}

module.exports = {
  devServer: {
    disableHostCheck: true,
    port: 5050
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  }
};
