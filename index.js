'use strict';

function merge() {
  var params = [].slice.apply(arguments),
      destination = params.shift();

  for (var i = 0, len = params.length; i < len; i += 1) {
    if (!params[i]) { continue; }
    for (var name in params[i]) {
      if (params[i].hasOwnProperty(name)) {
        destination[name] = params[i][name];
      }
    }
  }

  return destination;
}

function CompassBootstrapAddon(project) {
  this.project = project;
  this.name    = "Ember CLI add-on to install sass, compass and bootstrap-sass";
}

CompassBootstrapAddon.prototype.blueprintsPath = function () {
  return __dirname + '/blueprints';
};

CompassBootstrapAddon.prototype.included = function (app) {
  this.app = app;
};

module.exports  = CompassBootstrapAddon;
