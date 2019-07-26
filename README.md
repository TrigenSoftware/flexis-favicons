# @flexis/favicons

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]
[![Greenkeeper badge][greenkeeper]][greenkeeper-url]

[npm]: https://img.shields.io/npm/v/@flexis/favicons.svg
[npm-url]: https://npmjs.com/package/@flexis/favicons

[node]: https://img.shields.io/node/v/@flexis/favicons.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/TrigenSoftware/flexis-favicons.svg
[deps-url]: https://david-dm.org/TrigenSoftware/flexis-favicons

[build]: http://img.shields.io/travis/com/TrigenSoftware/flexis-favicons.svg
[build-url]: https://travis-ci.com/TrigenSoftware/flexis-favicons

[coverage]: https://img.shields.io/coveralls/TrigenSoftware/flexis-favicons.svg
[coverage-url]: https://coveralls.io/r/TrigenSoftware/flexis-favicons

[greenkeeper]: https://badges.greenkeeper.io/TrigenSoftware/flexis-favicons.svg
[greenkeeper-url]: https://greenkeeper.io/

Best lib to generating favicons for modern web.

## Install

```bash
npm i -D @flexis/favicons
# or
yarn add -D @flexis/favicons
```

## API

Module exposes next API:

```js
export default FaviconsGenerator;
export {
    IManifestConfig,
    IIconConfig,
	IIconsConfig,
    IHeadersConfig,
    IConfig,
    getHtmlHeadersMarkup
};
```

[Description of this methods you can find in Documentation.](https://trigensoftware.github.io/flexis-favicons/index.html)
