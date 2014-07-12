ember-cli-compass-bootstrap
===========================

This is an addon for [ember-cli](http://iamstef.net/ember-cli/) that adds support for:

  * [Compass](http://compass-style.org) (through bower package [compass-mixins](https://github.com/Igosuki/compass-mixins))
  * [Bootstrap for Sass](http://getbootstrap.com)

The package is using libsass (coming with ember-cli through broccoli-sass and node-sass) to benefit from
ultra fast preprocessing. Compass and Bootstrap for Sass are installed using bower.

## Usage

It is a two-steps installation process. You install the npm module, ember-cli will automatically
pick up the addon. You also need to generate a scss file, which will also update npm and bower
configuration files with the necessary dependencies.

First install the npm package:

```
npm install ember-cli-compass-bootstrap --save-dev
```

Then generate a new app.scss file and delete the old `app.css` file (after copying
any custom content to the new `app.scss`):

```
ember g scss app
rm app/styles/app.css
```

Finally install the new npm and bower packages added by the generator by running:

```
npm install
bower install
```
