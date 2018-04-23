/**
 * @file
 * Module handler.
 */

import fs from 'fs';
import path from 'path';

function module_handler() {
  this.modules = {};

  // TODO: move those to general config.
  this.infoExtension = 'info.json';
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
              try {
                var module = JSON.parse(fs.readFileSync(file_path));
              }
              catch (err) {
                console.log("Invalid JSON in the {1} info file.".replace('{1}', file_name));
                module = {};
              }
              if (module.hasOwnProperty('name')) {
                module.machine_name = file_name.slice(0, -(self.infoExtension.length + 1));
                module.enabled = false;

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

  /**
   * Load a set of modules.
   *
   * @param array modules
   *   Array of modules to load.
   */
  this.loadAll = function (modules) {
    // Load modules and their dependencies.
    modules.forEach(function (module) {
      self.load(module);
    });
  }

  /**
   * Module loader function.
   *
   * @param string module_name
   *   Machine name of the module.
   */
  this.load = function (module_name) {
    if (self.modules.hasOwnProperty(module_name)) {
      let module = self.modules[module_name];

      // Load dependencies, if exist.
      if (module.hasOwnProperty('dependencies')) {
        module.dependencies.forEach(function (dependency) {

          // Check if dependency wasn't loaded yet, if not, load it.
          if (self.modules.hasOwnProperty(dependency)) {
            if (!self.modules[dependency].enabled) {
              self.load(dependency);
            }
          }
          else {
            console.log("Missing dependency found: {1} in {2}.".replace('{1}', dependency).replace('{2}', module_name));
          }
        });
      }

      if (self.modules[module_name].files.length) {
        self.modules[module_name].files.forEach(function (file_name) {
          var file_path = path.join(path.dirname(require.main.filename), self.modules[module_name].path, file_name);
          self.modules[module_name].enabled = true;

          // Execute the main function of the loaded moule.
          require(file_path)();
        });
      }
      console.log("Module {1} has been enabled.".replace('{1}', module_name));
    }
    else {
      console.log("Module {1} is not present in the filesystem.".replace('{1}', module_name));
    }
  }

}

var moduleHandler = new module_handler();

export default moduleHandler;
