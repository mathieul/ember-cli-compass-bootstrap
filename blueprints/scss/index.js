var fs          = require('fs-extra');
var path        = require('path');
var chalk       = require('chalk');
var RSVP        = require('rsvp');
var npm         = require('npm');
var bower       = require('bower');
var bowerConfig = require('bower-config');

var _npmPackages = {'broccoli-merge-trees': '^0.1.4',
                    'broccoli-static-compiler': '^0.1.4',
                    'broccoli-sass': '^0.2.0'};

var _bowerPackages = {'bootstrap-sass-official': '3.2.0',
                      'compass-mixins': '1.0.0'};

var _brocInit = "var pickFiles  = require('broccoli-static-compiler');\n"
              + "var mergeTrees = require('broccoli-merge-trees');";

var _brocEnd  = "var bootstrapDir = 'vendor/bootstrap-sass-official/assets';\n\n"
              + "// select bootstrap JavaScript components to include\n"
              + "var bootstrapComponents = ['dropdown', 'alert'];\n\n"
              + "for (var index in bootstrapComponents) {\n"
              + "  app.import(bootstrapDir + '/javascripts/bootstrap/' + bootstrapComponents[index] + '.js');\n"
              + "}\n\n"
              + "var extraAssets = pickFiles(bootstrapDir + '/fonts/bootstrap', {\n"
              + "  srcDir: '/',\n"
              + "  destDir: '/assets/bootstrap'\n"
              + "});\n\n"
              + "module.exports = mergeTrees([app.toTree(), extraAssets]);";

module.exports = {
  locals: function(options) {
    return {
      modelname: options.entity.name,
      namespace: 'api'
    };
  },

  afterInstall: function (options) {
    var npmUpdater      = new ConfigUpdater('package.json'),
        bowerUpdater    = new ConfigUpdater('bower.json'),
        brocfileUpdater = new ScriptUpdater('Brocfile.js');

    npmUpdater.update('devDependencies', _npmPackages);
    npmUpdater.save();

    bowerUpdater.update('dependencies', _bowerPackages);
    bowerUpdater.save();

    brocfileUpdater.update(/(var EmberApp\s*=\s*require.+;)/, "$1\n" + _brocInit, _brocInit);
    brocfileUpdater.update(/module.exports\s*=\s*app.toTree\(\);/, _brocEnd);
    brocfileUpdater.save();

    return RSVP.all([npmInstall(), bowerInstall()]);
  }
};

function ConfigUpdater(name) {
  var configPath = path.join(name),
      content    = fs.readFileSync(configPath, 'utf-8'),
      config     = JSON.parse(content);

  this.name     = name;
  this.original = content;
  this.path     = configPath;
  this.config   = config;
}

ConfigUpdater.prototype.update = function (field, update) {
  var target = this.config[field];

  for (var name in update) {
    target[name] = target[name] || update[name];
  }
};

ConfigUpdater.prototype.save = function () {
  var content = JSON.stringify(this.config, null, '  ') + "\n";

  if (content !== this.original) {
    fs.writeFileSync(this.path, content);
    console.log(chalk.magenta("* updated " + this.name + "."));
  }
};

function ScriptUpdater(name) {
  var scriptPath = path.join(name),
      content    = fs.readFileSync(scriptPath, 'utf-8');

  this.name     = name;
  this.path     = scriptPath;
  this.original = content;
  this.content  = content;
}

ScriptUpdater.prototype.update = function (re, updated, existing) {
  existing = existing || updated;
  if (this.content.indexOf(existing) === -1) {
    this.content = this.content.replace(re, updated);
  }
};

ScriptUpdater.prototype.save = function () {
  if (this.content !== this.original) {
    fs.writeFileSync(this.path, this.content);
    console.log(chalk.magenta("* updated " + this.name + "."));
  }
};

function npmInstall() {
  return new RSVP.Promise(function (resolve, reject) {
    npm.load({}, function (err) {
      if (err) {
        reject(err);
      } else {
        npm.commands.install([], function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      }
    });
  }).then(function () {
    console.log(chalk.magenta("* installed npm packages."));
  });
}

function bowerInstall() {
  var config = bowerConfig.read();

  config.interactive = true;

  return new RSVP.Promise(function (resolve, reject) {
    bower.commands.install([], { save: true }, config)
      .on('error', reject)
      .on('end', resolve);
  }).then(function () {
    console.log(chalk.magenta("* installed bower packages."));
  });
}
