'use strict';

var mergeTrees = require('broccoli-merge-trees');

function CompassBootstrapAddon(project) {
  this.project = project;
  this.name    = "Ember CLI add-on to install sass, compass and bootstrap-sass";
}

CompassBootstrapAddon.prototype.blueprintsPath = function () {
  return __dirname + '/blueprints';
};

CompassBootstrapAddon.prototype.treeFor = function (type) {
  if (type !== 'styles') { return; }

  return mergeTrees([
    'vendor/bootstrap-sass-official/assets/stylesheets',
    'vendor/compass-mixins/lib'
  ]);
};

module.exports  = CompassBootstrapAddon;
