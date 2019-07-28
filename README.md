# @flexis/favicons

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]
[![Dependabot badge][dependabot]][dependabot-url]

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

[dependabot]: https://api.dependabot.com/badges/status?host=github&repo=TrigenSoftware/flexis-favicons
[dependabot-url]: https://dependabot.com/

A tool to generate icons for the modern web.

- Can use it as [CLI](#cli) tool, [Gulp plugin](#gulp) or [JS library](#js-api) 🦄
- Based on [Sharp](https://github.com/lovell/sharp) library - works fast 🚀
- Generates assets for modern things like [PWA](https://developers.google.com/web/progressive-web-apps/) 📲

## Install

```bash
npm i -D @flexis/favicons
# or
yarn add -D @flexis/favicons
```

## Usage

### CLI

```bash
npx favicons [...sources] [...options]
# or
yarn exec -- favicons [...sources] [...options]
```

| Option | Description | Default |
|--------|-------------|---------|
| sources | Source icon(s) glob patterns. | |
| &#x2011;&#x2011;help, -h | Print this message. | |
| &#x2011;&#x2011;verbose, -v | Print additional info about RegExps. | |
| &#x2011;&#x2011;path, -p | Relative public path to use in webmanifest and html-headers. | |
| &#x2011;&#x2011;background, -b | Background color for icons and startup images. | white |
| &#x2011;&#x2011;manifest, -m | Path to webmanifest file to add icons. Also can use it to get background color. | |
| &#x2011;&#x2011;headers, -H | Create html-file with headers for icons. | `false` |
| &#x2011;&#x2011;skipFavicon | Do not create favicon. | `false`
| &#x2011;&#x2011;skipAndroid | Do not create icons for Android. | `false`
| &#x2011;&#x2011;skipApple | Do not create icons for iOS. | `false`
| &#x2011;&#x2011;skipAppleStartup | Do not create startup screens for iOS. | `false`
| &#x2011;&#x2011;androidBackground | Background color for Android icons. |  |
| &#x2011;&#x2011;androidOffset | Offset size in percents for Android icons. | `0` |
| &#x2011;&#x2011;appleBackground | Background color for iOS icons. |  |
| &#x2011;&#x2011;appleOffset | Offset size in percents for iOS icons. | `0` |
| &#x2011;&#x2011;appleStartupBackground | Background color for iOS startup screens. |  |
| &#x2011;&#x2011;appleStartupOffset | Offset size in percents for iOS startup screens. | `0` |
| &#x2011;&#x2011;dest, -d | Destination directory. | |

Also you can create `.faviconsrc` file:

```ts
interface IConfig {
    src?: string|string[];
    path?: string;
    verbose?: boolean;
    background?: string;
    icons?: IIconsConfig;
    manifest?: string|IManifestConfig; // path to source manifset or manifest object
    headers?: boolean|IHeadersConfig;
    dest?: string;
}
```

- [`IIconsConfig`](https://trigensoftware.github.io/flexis-favicons/interfaces/_icons_.iiconsconfig.html)
- [`IManifestConfig`](https://trigensoftware.github.io/flexis-favicons/interfaces/_manifest_.imanifestconfig.html)
- [`IHeadersConfig`](https://trigensoftware.github.io/flexis-favicons/interfaces/_htmlheaders_.iheadersconfig.html)

#### Example

```bash
# From SVG
favicons src/favicon.svg --manifest src/manifest.json --headers -d build
# From some PNGs with different sizes
favicons "src/icons/*.png" --background "#FACE8D" --headers -d build
```

### Gulp

Also you can use `@flexis/favicons` with [Gulp](https://github.com/gulpjs/gulp):

```js
import favicons from '@flexis/favicons/stream';
import manifest from './src/manifest.json';

gulp.task('favicons', () =>
    gulp.src('src/favicon.svg')
        .pipe(favicons({
            manifest,
            headers: true
        }))
        .pipe(gulp.dest('build'))
);
```

Plugin options:

```ts
interface IPluginConfig {
    path?: string;
    verbose?: boolean;
    background?: string;
    icons?: IIconsConfig;
    manifest?: IManifestConfig;
    headers?: boolean|IHeadersConfig;
}
```

- [`IIconsConfig`](https://trigensoftware.github.io/flexis-favicons/interfaces/_icons_.iiconsconfig.html)
- [`IManifestConfig`](https://trigensoftware.github.io/flexis-favicons/interfaces/_manifest_.imanifestconfig.html)
- [`IHeadersConfig`](https://trigensoftware.github.io/flexis-favicons/interfaces/_htmlheaders_.iheadersconfig.html)

### JS API

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

#### Example

```js
import {
    promises as fs
} from 'fs';
import FaviconsGenerator, {
    getHtmlHeadersMarkup
} from '@flexis/favicons';
import Vinyl from 'vinyl';
import manifest from './src/manifest.json';

async function generate() {

    const path = 'src/favicon.svg';
    const contents = await fs.readFile(path);
    const source = new Vinyl({
        path,
        contents
    });
    const favicons = new FaviconsGenerator({
        manifest
    });
    const icons = favicons.generateIcons(source);

    for await (const icon of icons) {
        icon.base = './build';
        await fs.writeFile(icon.path, icon.contents);
    }

    const headers = favicons.generateHtmlHeaders();
    const html = getHtmlHeadersMarkup(headers);

    await fs.writeFile('build/favicons.html', html);

    const manifest = favicons.generateManifset();
    const json = JSON.stringify(manifest);

    await fs.writeFile('build/manifest.json', json);
}

generate();
```
