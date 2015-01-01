ember-cli-compass-bootstrap
===========================

Note that this package is not as useful since releases 0.1.x of *ember-cli* as it now makes using sass really painless. Look for an alternative to using this package at the bottom of this README (section **Alternative**)

This is an addon for [ember-cli](http://iamstef.net/ember-cli/) that adds support for:

  * [Compass](http://compass-style.org) (through bower package [compass-mixins](https://github.com/Igosuki/compass-mixins))
  * [Bootstrap for Sass](http://getbootstrap.com)

It requires ember 0.1.5+.

The package is using libsass (coming with ember-cli through broccoli-sass and node-sass) to benefit from ultra fast preprocessing. Compass and Bootstrap for Sass are installed using bower.

## Usage

It is a two-steps installation process. You install the npm module, ember-cli will automatically pick up the addon. You also need to generate a scss file, which will also update npm and bower configuration files with the necessary packages and install them.

First install the npm package:

```
npm install ember-cli-compass-bootstrap --save-dev
```

Then generate a new app.scss file and delete the old `app.css` file (after copying any custom content to the new `app.scss`):

```
ember g scss app
rm app/styles/app.css
```

## Blueprints

Besides the `scss` blueprint intended to setup an application to use Compass and Bootstrap, another blueprint `bootstrap` can be used to generate templates using Bootstrap markup.

`ember g bootstrap application type:navbar-fixed`

Current supported types are:

* `navbar`
* `navbar-fixed`
* `sign-in`
* `started` (default)

## Alternative

If all you want is using Bootstrap with Sass (and maybe Compass Mixins), you can very well add the packages and do some configuration yourself and avoid a package dependency.

Here is how I'd do it from a freshly generated app using ember-cli v0.1.5:

```
ember install:npm broccoli-sass
mv app/styles/app.css app/styles/app.scss
ember install:bower bootstrap-sass-official
ember install:bower compass-mixins
```

You can then edit your `Brocfile.js` file and replace content with:

```
/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

var bootstrapDir = app.bowerDirectory + '/bootstrap-sass-official/assets';

// select bootstrap JavaScript components to include
var bootstrapComponents = ['dropdown', 'alert', 'transition'];

for (var index in bootstrapComponents) {
  app.import(bootstrapDir + '/javascripts/bootstrap/' + bootstrapComponents[index] + '.js');
}

module.exports = app.toTree();
```

And finally create your custom `app/styles/_bootstrap.scss` partial to customize bootstrap to your needs:

`cp bower_components/bootstrap-sass-official/assets/stylesheets/_bootstrap.scss app/styles`

Edit the file to update the paths from `"bootstrap/xxx"` to `"bower_components/bootstrap-sass-official/assets/stylesheets/bootstrap/xxx"` (i.e.: `@import "bower_components/bootstrap-sass-official/assets/stylesheets/bootstrap/variables";`) and append the following to your `app/styles/app.scss` file:

`@import "bootstrap";`

You're now ready to customize `app/styles/_bootstrap.scss` to your needs by commenting out the components you don't use or adjusting bootstrap variables such as the number of columns in one row (i.e.: prepend to the top of the `_bootstrap.scss` file: `$grid-columns: 24;` to get 24 columns instead of 12).
