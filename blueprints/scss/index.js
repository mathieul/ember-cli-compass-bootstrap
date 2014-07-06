var fs        = require('fs-extra');
var path      = require('path');

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
              + "module.exports = mergeTrees([app.toTree(), extraAssets]);\n";

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

    brocfileUpdater.update(/(var EmberApp\s*=\s*require.+;)/, "$1\n" + _brocInit);
    brocfileUpdater.update(/module.exports\s*=\s*app.toTree\(\);/, _brocEnd);
    brocfileUpdater.save();
  }
};

function ConfigUpdater(name) {
  var configPath = path.join(name),
      content    = fs.readFileSync(configPath, 'utf-8'),
      config     = JSON.parse(content);

  this.path = configPath;
  this.config = config;
}

ConfigUpdater.prototype.update = function (field, update) {
  var target = this.config[field];

  for (var name in update) {
    target[name] = target[name] || update[name];
  }
};

ConfigUpdater.prototype.save = function () {
  var content = JSON.stringify(this.config, null, '  ') + "\n";

  fs.writeFileSync(this.path, content);
};

function ScriptUpdater(name) {
  var scriptPath = path.join(name),
      content    = fs.readFileSync(scriptPath, 'utf-8');

  this.path = scriptPath;
  this.content = content;
}

ScriptUpdater.prototype.update = function (re, updated) {
  this.content = this.content.replace(re, updated);
};

ScriptUpdater.prototype.save = function () {
  fs.writeFileSync(this.path, this.content);
};
