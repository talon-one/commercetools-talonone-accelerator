'use strict';
const fs = require('fs');
const path = require('path');

class BuildOptimizerPlugin {
  constructor() {
    this.hooks = {
      'webpack:package:packExternalModules': async () => {
        const serviceDir = path.resolve(__dirname, '../../.webpack/service');
        const nodeFetchDir = path.resolve(serviceDir, 'node_modules/node-fetch');
        const nodeFetchLibDir = path.resolve(nodeFetchDir, 'lib');
        const rm = (dir, file) => {
          try {
            fs.unlinkSync(path.resolve(dir, file));
          } catch (e) {
            console.error(e);
          }
        };

        rm(serviceDir, 'yarn.lock');

        fs.readdirSync(nodeFetchDir).forEach((file) => {
          if (/\.md$/.test(file)) {
            rm(nodeFetchDir, file);
          }
        });

        fs.readdirSync(nodeFetchLibDir).forEach((file) => {
          if (!/^index\.js$/.test(file)) {
            rm(nodeFetchLibDir, file);
          }
        });
      },
    };
  }
}

module.exports = BuildOptimizerPlugin;
