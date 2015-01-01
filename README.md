ember-cli-compass-bootstrap
===========================

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

```ember g bootstrap application type:navbar-fixed```

Current supported types are:

* `navbar`
* `navbar-fixed`
* `sign-in`
* `started` (default)
