/**
 * @file
 * Module handler.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

function module_handler() {
  this.modules = {};

  // TODO: move those to general config.
  this.infoExtension = 'info.yml';
  this.moduleFolders = ['./core/modules', './modules'];
  var self = this;

  // Populate modules object.
  this.moduleFolders.forEach(function (modules_dir) {
    var folders = fs.readdirSync(modules_dir);
    folders.forEach(function (folder) {
      var folder_path = path.join(modules_dir, folder);
      if (fs.lstatSync(folder_path).isDirectory()) {
        fs.readdirSync(folder_path).forEach(function (file_name) {
          var file_path = path.join(folder_path, file_name);
          if (!fs.lstatSync(file_path).isDirectory()) {

            // TODO: Add support for nested folder structure: recursion.
            if (file_name.slice(-self.infoExtension.length) == self.infoExtension) {
              var module = yaml.load(fs.readFileSync(file_path));
              if (module.hasOwnProperty('name')) {
                module.machine_name = file_name.slice(0, -(self.infoExtension.length + 1));

                // Files to load - add [module_name].js as a default.
                if (!module.hasOwnProperty('files')) {
                  if (fs.existsSync(path.join(folder_path, module.machine_name + '.js'))) {
                    module.files = [module.machine_name + '.js'];
                  }
                }
                module.path = folder_path;
                self.modules[module.machine_name] = module;
              }
            }
          }
        });
      }
    });
  });

  this.load = function (module_name) {
    if (self.modules.hasOwnProperty(module_name)) {
      if (self.modules[module_name].files.length) {
        self.modules[module_name].files.forEach(function (file_name) {
          var file_path = path.join(path.dirname(require.main.filename), self.modules[module_name].path, file_name);
          require(file_path)();
        });
      }
    }
    else {
      console.log("Module {1} is not present in the filesystem.".replace('{1}', module_name));
    }
  }
}

var moduleHandler = new module_handler();

export default moduleHandler;
