var fs        = require('fs-extra');
var path      = require('path');

var _npmPackages = {'broccoli-merge-trees': '^0.1.4',
                    'broccoli-static-compiler': '^0.1.4',
                    'broccoli-sass': '^0.2.0'};

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

var _updatePackageJson = function () {
  var configPath = path.join(process.cwd(), 'package.json'),
      content    = fs.readFileSync(configPath, 'utf-8'),
      config     = JSON.parse(content),
      dev        = config.devDependencies,
      name, version;

  for (name in _npmPackages) {
    version = _npmPackages[name];
    dev[name] = dev[name] || version;
  }
  content = JSON.stringify(config, null, '  ');

  fs.writeFileSync(configPath, content);
};

var _updateBrocfile = function () {
  var brocfilePath = path.join(process.cwd(), 'Brocfile.js'),
      content = fs.readFileSync(brocfilePath, 'utf-8'),
      reInitMark = /(var EmberApp\s*=\s*require.+;)/,
      reEndMark  = /module.exports\s*=\s*app.toTree\(\);/;

  content = content.replace(reInitMark, "$1\n" + _brocInit);
  content = content.replace(reEndMark, _brocEnd);

  fs.writeFileSync(brocfilePath, content);
};

module.exports = {
  locals: function(options) {
    return {
      modelname: options.entity.name,
      namespace: 'api'
    };
  },

  afterInstall: function (options) {
    _updatePackageJson();
    _updateBrocfile();
  }
};
