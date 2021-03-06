# @flexis/favicons

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]
[![Dependabot badge][dependabot]][dependabot-url]
[![Documentation badge][documentation]][documentation-url]

[npm]: https://img.shields.io/npm/v/@flexis/favicons.svg
[npm-url]: https://npmjs.com/package/@flexis/favicons

[node]: https://img.shields.io/node/v/@flexis/favicons.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/TrigenSoftware/flexis-favicons.svg
[deps-url]: https://david-dm.org/TrigenSoftware/flexis-favicons

[build]: https://img.shields.io/travis/com/TrigenSoftware/flexis-favicons/master.svg
[build-url]: https://travis-ci.com/TrigenSoftware/flexis-favicons

[coverage]: https://img.shields.io/coveralls/TrigenSoftware/flexis-favicons.svg
[coverage-url]: https://coveralls.io/r/TrigenSoftware/flexis-favicons

[dependabot]: https://api.dependabot.com/badges/status?host=github&repo=TrigenSoftware/flexis-favicons
[dependabot-url]: https://dependabot.com/

[documentation]: https://img.shields.io/badge/API-Documentation-2b7489.svg
[documentation-url]: https://trigensoftware.github.io/flexis-favicons

A tool for generating icons for the modern web.

- Traditional web favicons ❤️
- Android and iOS icons, iOS startup screens 🖼
- Generates assets for [PWA](https://developers.google.com/web/progressive-web-apps/) 📲
- You can run it from the [CLI](#cli) ⌨️
- Works with [Gulp](#gulp) and as [JS library](#js-api) 🦄
- Based on [Sharp](https://github.com/lovell/sharp) library - lightning fast ⚡️

<img src="https://pbs.twimg.com/media/EAyJvr5WsAEhw3F?format=jpg&name=medium" width="80%">

## Install

```sh
npm i -D @flexis/favicons
# or
yarn add -D @flexis/favicons
```

## Usage

### CLI

```sh
npx favicons [...sources] [...options]
# or
yarn exec -- favicons [...sources] [...options]
```

| Option | Description | Default |
|--------|-------------|---------|
| sources | Source icon(s) glob patterns. | |
| &#x2011;&#x2011;help, -h | Print this message. | |
| &#x2011;&#x2011;verbose, -v | Print additional info about progress. | |
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

#### Example

```sh
# From SVG
favicons src/favicon.svg --manifest src/manifest.json --headers -d build
# From some PNGs with different sizes
favicons "src/icons/*.png" --background "#FACE8D" --headers -d build
```

#### Configuration

Configuration file is optional. If needed, can be defined through `.faviconsrc` JSON file in the root directory of the project.

Supported options:

```ts
interface IConfig {
    /**
     * Source icon(s) glob patterns.
     */
    src?: string | string[];
    /**
     * Relative public path to use in webmanifest and html-headers.
     */
    path?: string;
    /**
     * Background color for icons and startup images.
     */
    background?: string;
    /**
     * Path to webmanifest or webmanifest object to add icons. Also can use it to get background color.
     */
    manifest?: string | IManifestConfig;
    /**
     * Output icons configuration.
     */
    icons?: IIconsConfig;
    /**
     * Create html-file with headers for icons.
     */
    headers?: boolean | IHeadersConfig;
    /**
     * Print additional info about progress.
     */
    verbose?: boolean;
    /**
     * Destination directory.
     */
    dest?: string;
}
```

- [`IIconsConfig`](https://trigensoftware.github.io/flexis-favicons/interfaces/_src_types_.iiconsconfig.html)
- [`IManifestConfig`](https://trigensoftware.github.io/flexis-favicons/interfaces/_src_types_.imanifestconfig.html)
- [`IHeadersConfig`](https://trigensoftware.github.io/flexis-favicons/interfaces/_src_types_.iheadersconfig.html)

### Gulp

Also you can use `@flexis/favicons` with [Gulp](https://github.com/gulpjs/gulp):

```js
import favicons from '@flexis/favicons/lib/stream';
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
    /**
     * Relative public path to use in webmanifest and html-headers.
     */
    path?: string;
    /**
     * Background color for icons and startup images.
     */
    background?: string;
    /**
     * Webmanifest to add icons. Also can use it to get background color.
     */
    manifest?: IManifestConfig;
    /**
     * Output icons configuration.
     */
    icons?: IIconsConfig;
    /**
     * Create html-file with headers for icons.
     */
    headers?: boolean | IHeadersConfig;
    /**
     * Print additional info about progress.
     */
    verbose?: boolean;
}
```

- [`IIconsConfig`](https://trigensoftware.github.io/flexis-favicons/interfaces/_src_types_.iiconsconfig.html)
- [`IManifestConfig`](https://trigensoftware.github.io/flexis-favicons/interfaces/_src_types_.imanifestconfig.html)
- [`IHeadersConfig`](https://trigensoftware.github.io/flexis-favicons/interfaces/_src_types_.iheadersconfig.html)

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

[Description of all methods you can find in Documentation.](https://trigensoftware.github.io/flexis-favicons/index.html)

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

[<img src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png" width="300">](https://www.browserstack.com)
